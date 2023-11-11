import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { TimelineEvent } from '../model/timeline-event';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent {
  
  newEvent: TimelineEvent = {
    event_id: 0,
    event_name: '',
    start_date: null,
    end_date: null,
    description: '',
    image_url: '',
    category_id: 0
  };

  categories: any[];
  dateError: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categories = data.categories;
    if (data.event !== undefined && data.event !== null) {
      this.newEvent.event_id = data.event.event_id;
      this.newEvent.event_name = data.event.event_name;
      this.newEvent.start_date = data.event.start_date;
      this.newEvent.end_date = data.event.end_date;
      this.newEvent.description = data.event.description;
      this.newEvent.image_url = data.event.image_url;
      this.newEvent.category_id = data.event.category_id;
    }
  }

  onSubmit(): void {
    // TODO dodać warunek na sprawdzenie dat
    this.dialogRef.close(this.newEvent);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date | null): String {
    return date ? new Date(date).toISOString().substring(0, 10) : '';
}

  updateStartDate(event: any): void {
    if (event) {
      this.newEvent.start_date = event;
    }
    this.checkDates();
  }

  updateEndDate(event: any): void {
    if (event) {
      this.newEvent.end_date = event;
    }
    this.checkDates();
  }

  checkDates(): void {
    if (this.newEvent.start_date && this.newEvent.end_date && new Date(this.newEvent.start_date) > new Date(this.newEvent.end_date)) {
      this.dateError = true; 
    } else {
      this.dateError = false; 
    }
  }

}
