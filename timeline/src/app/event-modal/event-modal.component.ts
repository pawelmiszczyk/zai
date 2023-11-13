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
    image: null,
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
      this.newEvent.image = data.event.image_url;
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

  formatDate(date: Date | null): string {
    if (date !== null) {
      const localDateTime = new Date(date).toLocaleString('en-US', { timeZone: 'Europe/Belgrade' });
      const isoDateTimePlusOneHour = new Date(localDateTime);
      isoDateTimePlusOneHour.setHours(isoDateTimePlusOneHour.getHours() + 1);
      return isoDateTimePlusOneHour.toISOString().substring(0, 10);
    }
  
    return '';
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

  onImageSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.readAndSetImage(file);
    }
  }

  readAndSetImage(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      // e.target.result zawiera dane obrazka w formie base64
      this.newEvent.image = e.target.result;
    };

    reader.readAsDataURL(file);
  }

}
