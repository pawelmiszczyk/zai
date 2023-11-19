import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineComponent } from './timeline/timeline.component';
import { EventManagementComponent } from './event-management/event-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { EventModalComponent } from './event-modal/event-modal.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';

import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from "primeng/card"; 

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    EventManagementComponent,
    CategoryManagementComponent,
    EventModalComponent,
    CategoryModalComponent
  ],
  imports: [
    BrowserModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSortModule,
    MatTableModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    MatDialogModule,
    AccordionModule,
    PanelModule,
    TimelineModule,
    CardModule,
    MatSelectModule,
    DropdownModule,
  ],
  exports: [EventModalComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
