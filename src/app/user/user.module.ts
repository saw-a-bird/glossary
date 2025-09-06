import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { HomeModule } from './home/home.module';
import { HomeComponent } from './home/home.component';
import { GlosseryModule } from './glossery/glossery.module';
import { GlosseryComponent } from './glossery/glossery.component';
import { ReferenceModule } from './reference/reference.module';
import { ReferenceComponent } from './reference/reference.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    UserComponent,
    HomeComponent,
    GlosseryComponent,
    ReferenceComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UserRoutingModule,
    HomeModule,
    GlosseryModule,
    ReferenceModule,
    HttpClientModule
  ],
  exports: [
    UserComponent,
    HomeComponent,
    GlosseryComponent,
    ReferenceComponent
  ]
})

export class UserModule { }
