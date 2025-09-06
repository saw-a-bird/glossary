import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlosseryComponent } from './user/glossery/glossery.component';
import { HomeComponent } from './user/home/home.component';
import { UserComponent } from './user/user.component';
import { ReferenceComponent } from './user/reference/reference.component';
import { AdminComponent } from './admin/admin.component';
import { AddComponent } from './admin/add/add.component';
import { EditComponent } from './admin/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component : UserComponent, 
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'glossery',
        component: GlosseryComponent,
      },
      {
        path: 'reference/:idRef',
        component: ReferenceComponent,
      }
    ]},
    
  { path : 'admin', component : AdminComponent,
    children: [
      {
        path: 'add',
        component: AddComponent, 
      },
      {
        path: 'edit/:idRef',
        component: EditComponent,
      }
    ]},
  { path: '**' , redirectTo: '/home'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
