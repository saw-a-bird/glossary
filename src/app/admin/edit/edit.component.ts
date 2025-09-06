import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { referenceService } from '../../services/reference.service';
import { AutoTextareaDirective } from '../../assets/directives/textarea-autoresize.directive';
import { Reference } from '../../assets/models/references';
import { faBold, faUnderline, faTextWidth, faItalic } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-edit',
  templateUrl: '../form/form.component.html',
  styleUrls: ['../form/form.component.scss']
})

export class EditComponent implements OnInit {
  faIcons = [faBold, faItalic, faUnderline, faTextWidth];
  idRef!: number;
  formName?: string = "Edit";
  referenceForm!: FormGroup;
  dataRef?: Reference;
  notification?: any =  null;
  isLoaded: boolean =  false;// store subscription in a variable
  private formChangesSub?: Subscription;
  markdownText = '';

  @ViewChild(AutoTextareaDirective) directive!: AutoTextareaDirective;
  firstContentLoad: boolean = true;
  
  constructor(private fb: FormBuilder, private referenceService: referenceService, private activatedRoute: ActivatedRoute, private router: Router) {     
    this.referenceForm = fb.group({
        title: fb.control('', Validators.required),
        content: fb.control('', Validators.required),
        tags: fb.control(''),   // optional
        links: fb.control('')   // optional
    });

    this.referenceForm.disable({emitEvent: false});
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    
    this.notification = {"code": 0, "type": "none", "text": null};

    const navigation = this.router.getCurrentNavigation();
    const isNew = navigation?.extras.state?.isNew;
    if (isNew) {
      this.setNotification(3);
    } else {
      this.setNotification(1);
    }
  } 

  ngOnInit(): void { 
  }

  ngAfterViewInit() {
    console.log("FORM: loading...");
    this.activatedRoute.params.subscribe(event => {
      this.idRef = event.idRef;
      this.referenceService.getReference(this.idRef).subscribe(
        data => {
          this.dataRef = data;
          this.referenceForm.enable({emitEvent: false});
          this.referenceForm.patchValue({
            title: [data.title || ''],
            content: [data.content || ''],
            tags: [data.tags || ''], 
            links: [data.links || '']
          });
          
          if (this.notification.code == 1) { // is loading
            this.setNotification(0);
          }
          
          this.updateContent(this.dataRef?.content);
          this.subscribeChanges(); // event which removed notifications after any modification
          this.referenceForm.get('content')?.valueChanges.subscribe(value => { // get markdown on each update
            this.updateContent(value);
          });

          this.isLoaded = true;
        },
        error => {
          console.error("Unable to POST because:", error)
        }
      );
    });
  }

  subscribeChanges() {
    this.formChangesSub = this.referenceForm.valueChanges.subscribe(() => {
      if (this.notification.code > 0) {
        this.setNotification(0);  // clear message
      }
    });
  }

  iconClick(fa: any) {
    this.directive.apply(fa.iconName);
  }
   convertEmptyLinesToBr(input: string): string {
      if (!input) return '';

      // Split into lines
      const lines = input.split('\n');

      // Find last non-empty line
      let lastNonEmptyIndex = lines.length - 1;
      while (lastNonEmptyIndex >= 0 && lines[lastNonEmptyIndex].trim() === '') {
        lastNonEmptyIndex--;
      }

      // Map lines: replace empty lines with <br> only if not trailing

      let inCodeBlock = false;
      return lines
        .map((line, index) => {
          const trimmed = line.trim();

          // Detect start/end of fenced code blocks
          if (trimmed.startsWith('```')) {
            inCodeBlock = !inCodeBlock; // toggle
            return line;
          }
              
          // Only replace empty lines outside code blocks and before the last content line
          if (!inCodeBlock && trimmed === '' && index <= lastNonEmptyIndex) 
            return '</br>';
          else if (!inCodeBlock && !trimmed.startsWith("#"))
            return line+ '</br>'
          return line;
        })
        .join('\n');
    }


  updateContent(formContent? : string) {
    const content = formContent || "";
    console.log(content)
    this.markdownText = this.convertEmptyLinesToBr(content);
    console.log(this.markdownText)
  }

  finalEdit() { // Adding dates and lowering tag cases.
    this.referenceForm?.get("tags")?.setValue(
      (this.referenceForm?.get("tags")?.value ?? '').toString().toLowerCase()
    );

    this.referenceForm?.addControl('creation_date', this.fb.control(this.dataRef!.creation_date));
    this.referenceForm?.addControl('modification_date', this.fb.control(Date()));
  }


  // TODO: check title availability in DB // cannot be empty // back- up
  onSubmit() : void {
    this.setNotification(2);
    this.formChangesSub?.unsubscribe();
    this.finalEdit();
    this.subscribeChanges(); // to prevent delayed event removing the next message immediately
    this.referenceService.editReference(this.idRef, this.referenceForm.getRawValue()).then(() => {
      this.setNotification(4);
    })
    .catch(error => {
      console.error('Error saving data:', error);
    });
  }

  setNotification(code : number) {
    this.notification.code = code;
    this.notification.type = code > 2 ? "success": (code < 0 ? "error" : "none");
    switch(code) {
        case 0:
          this.notification.text = null;
          break;
        case 1:
          this.notification.text = "Loading...";
          break;
        case 2:
          this.notification.text = "Processing...";
          break;
        case 3:
          this.notification.text = "Successfuly added a new record.";
          break;
        case 4:
          this.notification.text = "Successfuly edited this record.";
          break;
        default:
          this.notification.text = "Unknown code number."
          break;
    }
  }
}

