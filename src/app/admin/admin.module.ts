import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { GesterrModule } from '../admin/gesterr/gesterr.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoTextareaDirective } from '../assets/directives/textarea-autoresize.directive';
import { ShowComponent } from '../user/reference/show/show.component';
import { ReferenceModule } from '../user/reference/reference.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AdminComponent,
    AddComponent,
    EditComponent,
    AutoTextareaDirective
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    GesterrModule,
    ReactiveFormsModule,
    ReferenceModule,
    FontAwesomeModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      "sanitize": SecurityContext.NONE
    }),   // Initialize Markdown module 
  ],
  exports: [
    AdminComponent,
    AddComponent,
    EditComponent,
    AutoTextareaDirective,
    ShowComponent
  ]
})
export class AdminModule { }
