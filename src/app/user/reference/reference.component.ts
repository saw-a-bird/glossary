import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reference } from '../../assets/models/references';
import { referenceService } from '../../services/reference.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {

  Ref!: Reference;

  constructor(private referenceService: referenceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    var self = this;
    this.activatedRoute.params.subscribe(event => {
      this.referenceService.getReference(event.idRef).subscribe(
        data => self.Ref = data
      );
    });
  }

}
