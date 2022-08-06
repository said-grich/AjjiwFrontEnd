import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ComplaintsListComponent} from "./complaints-list/complaints-list.component";
import { CompliantDetailesComponent } from './complaints-list/compliant-detailes/compliant-detailes.component';


const  routes:Routes=[

  {
    path:"login",component:LoginComponent
  },
  {
    path:"",component:DashboardComponent,
  },
  {
    path:"complaintList",component:ComplaintsListComponent
  },
  {
    path:"complaintDetails",component:CompliantDetailesComponent
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
