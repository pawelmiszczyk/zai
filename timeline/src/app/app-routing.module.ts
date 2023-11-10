import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component'; 
import { EventManagementComponent } from './event-management/event-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component'; 

const routes: Routes = [
  { path: '', component: TimelineComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'event-management', component: EventManagementComponent },
  { path: 'category-management', component: CategoryManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
