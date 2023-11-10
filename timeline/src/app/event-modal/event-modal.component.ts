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

  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categories = data.categories;
    if (data.event !== undefined && data.event !== null) {
      this.newEvent = data.event
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
    return date ? new Date(date).toISOString().substring(0, 10) : '';
}

  updateStartDate(event: any): void {
    if (event && event.target && event.target.value) {
      this.newEvent.start_date = event.target.value;
    }
  }

  updateEndDate(event: any): void {
    if (event && event.target && event.target.value) {
      this.newEvent.end_date = event.target.value;
    }
  }

}
