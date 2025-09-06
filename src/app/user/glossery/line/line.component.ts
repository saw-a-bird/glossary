
import { Component, OnInit, Input, ViewChild, ElementRef, Inject, LOCALE_ID } from '@angular/core';
import { Reference } from '../../../assets/models/references';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  @Input() line!: Reference;
  @Input() tagsHighlight?: string[];
  foundTags: string = "";
  otherTags: string = "";
  @ViewChild('tags') tags!:ElementRef;
  
  constructor(@Inject(LOCALE_ID) private locale: string) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.taggingContent();
  }

  taggingContent() : void {
    var self = this;
    this.line?.tags?.split(' ').forEach(function(value) {
      if (self.tagsHighlight!.includes("#"+value.toLowerCase())) {
        self.foundTags += "<a class = 'badge bg-info' style = 'text-decoration:none;margin-left: 5px; font-size: 10px'>"+value+"</a>";
      } else {
        self.otherTags += "<a class = 'badge bg-light text-dark' style = 'text-decoration:none;margin-left: 5px; font-size: 10px'> "+value+" </a>";
      }
    });

    this.tags.nativeElement.insertAdjacentHTML('beforeend', self.foundTags + self.otherTags);

  }

  getDate(date: Date) {
    return formatDate(date, "mm/dd/yyyy hh:MM:ss ", this.locale);
  }
}

