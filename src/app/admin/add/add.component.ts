import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { referenceService } from '../../services/reference.service';
import { faUnderline, faTextWidth, faItalic, faBold } from '@fortawesome/free-solid-svg-icons';
import { AutoTextareaDirective } from '../../assets/directives/textarea-autoresize.directive';
import { Reference } from 'src/app/assets/models/references';

@Component({
  selector: 'app-add',
  templateUrl: '../form/form.component.html',
  styleUrls: ['../form/form.component.scss']
})

export class AddComponent implements OnInit {
  faIcons = [faBold, faItalic, faUnderline, faTextWidth];
  formName?: string = "Add";
  errors?: any;
  referenceForm!: FormGroup;
  @ViewChild(AutoTextareaDirective) directive!: AutoTextareaDirective;
  notification?: any;
  isLoaded: boolean = true;
  markdownText = '';

  constructor(private fb: FormBuilder, private referenceService: referenceService, private router: Router) {
    this.referenceForm = fb.group({
        title: fb.control('', Validators.required),
        content: fb.control('', Validators.required),
        tags: fb.control(''),   // optional
        links: fb.control('')   // optional
    });
    
    this.notification = {"code": 0, "type": "none", "text": null};
   } 

  ngOnInit(): void {
    this.referenceForm.get('content')?.valueChanges.subscribe(value => {
      this.markdownText = value || '';
    });
    
  }

  iconClick(fa: any) {
    this.directive.apply(fa.iconName);
  }

  updateContent() : string {
    return `# Title

Some text with **bold** and *italic*.`;
    // return (this.directive ? this.directive.getContent() : this.referenceForm?.get("content")?.value || "");
  }

  onSubmit() : void {
    this.referenceForm.errors
    this.finalEdit();
    this.referenceService.addReference(this.referenceForm.getRawValue())
    .then(
      (ref)  => {
        this.router.navigate(['/admin/edit', ref.key], {
          state: { isNew: true }
        });
      },
      error => {
        this.errors = error;
        alert(this.errors);
      }
    );
  }

  finalEdit() {
    this.referenceForm?.get("tags")?.setValue(
      (this.referenceForm?.get("tags")?.value ?? '').toString().toLowerCase()
    );

    this.referenceForm?.addControl('creation_date', this.fb.control(Date()));
  }
}
