
import { Component, OnInit, Input } from '@angular/core';
import { Pin } from 'src/app/assets/models/pin';
import { Reference } from '../../assets/models/references';
import { referenceService } from '../../services/reference.service';


@Component({
  selector: 'app-glossery',
  templateUrl: './glossery.component.html',
  styleUrls: ['./glossery.component.scss']
})

export class GlosseryComponent implements OnInit {

  @Input() search! : string;
  public searchWords! : string[];
  public searchTags! : string[];
  public tags: Pin[] = [];
  public references! : Reference[];

  runCount = 0;
  visiblityAnimation = {
    pulsing: false,
    appearing: false
  }

  constructor(private referenceService: referenceService) { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    if (this.runCount == 2) {
      this.visiblityAnimation.pulsing = true;
    } else {
      if (this.runCount == 1) {
        this.visiblityAnimation.appearing = true;
      }
      this.loadContent();
      this.runCount++;
    }
  }
  
  loadContent() : void {
    // filterReferences
    if (this.search) {
      if (this.search.length == 0) {
        this.getAllReferences();
      } else {
           // get all strs that start with '#'
          this.searchTags = this.search.match(/#(\w+)/g) || [];
          this.searchWords = this.search.match(/(^|\s)(\w+)/g) || [];
          this.start_search();
      }
    }
  }

  start_search(): void {
    console.log("Glossary: getting references...");
    console.log("search words : "+this.searchWords);
    console.log("search tags : "+this.searchTags);

    if (this.searchWords.length == 0) {
      this.referenceService.filterReferencesByTags(this.searchTags).subscribe(data => this.initReferences(data));
    } else {
      this.referenceService.filterReferences(this.searchWords, this.searchTags).subscribe(data => this.initReferences(data));
    }
  }

  initReferences(data : Reference[]) {
    this.references = data; 
    this.getFoundPins();
  }

  // onClick tag
  byTag(event: Event) {
    var tag = (event.target as HTMLElement).innerHTML
    console.log("Glossary: getting references...");
    console.log("search tag : "+tag)
    this.tags = this.tags.filter(pin => pin.id == tag);
    
    this.referenceService.filterReferencesByTag(tag).subscribe(data => this.initReferences(data));
  }

  // ALL
  getAllReferences(): void {
    this.referenceService.getReferences().subscribe(data => this.initReferences(data));
  }

  getFoundPins(): void {
    console.log("Glossary: getting pins...");

    // get all tags
    var self = this;
    self.tags = [];
    
    this.references.forEach(function(reference) {
      reference.tags?.split(' ').forEach(function(tag : string) {
        if (tag != "") {
          let item = self.tags.find(i => i.id === tag);
          if (item === undefined) {
            self.tags.push({id: tag, count: 1});
          } else {
            item.count++;
          }
        }
      })
    });
  }
}
