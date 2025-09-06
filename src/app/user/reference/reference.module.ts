import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ShowComponent } from './show/show.component';


@NgModule({
  declarations: [
    ShowComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShowComponent
  ]
})
export class ReferenceModule { }
