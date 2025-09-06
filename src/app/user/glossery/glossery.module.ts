import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlosseryRoutingModule } from './glossery-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LineComponent } from './line/line.component';

@NgModule({
  declarations: [
    LineComponent
  ],
  imports: [
    CommonModule,
    GlosseryRoutingModule,
    HttpClientModule
  ],
  exports: [
    LineComponent
  ]
})

export class GlosseryModule { }
