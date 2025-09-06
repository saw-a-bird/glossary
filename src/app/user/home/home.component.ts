import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router'; // CLI imports router
import { referenceService } from '../../services/reference.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  searchControl = new FormControl('');
  searchString : string = "";
  @ViewChild('searchDiv') search_div!:ElementRef;
  @ViewChild('searchBar') search_bar!:ElementRef;
  @ViewChild('appTitle') app_title!:ElementRef;

  constructor(private referenceService: referenceService, private router: Router) { }

  ngOnInit() { }

  
  onSubmit(): void {
    var str = this.search_bar.nativeElement.value;
    if (str != "") {

      if (str == "admin:add")
        this.router.navigateByUrl('/admin/add');
      else if (str.includes("admin:edit:")) 
        this.router.navigateByUrl('/admin/edit/'+str.split(":")[2]);
      else if (str.includes("admin:remove:")) {
        this.referenceService.deleteReference(str.split(":")[2]);
        console.log("delete");
      } else {
        console.log("HOME: animation..");
        this.search_div.nativeElement.classList.add("moveBar");
        this.app_title.nativeElement.style.opacity = "0" ;
        this.search_bar.nativeElement.classList.add("_true_margin");
        
        new Promise<void>((resolve) => {
          setTimeout(() => {
            console.log("HOME: sent search request '"+this.searchControl.value+"'");
            this.searchString = this.searchControl.value;
            resolve();
          }, 900);
        });
      }
    }
  }

}

