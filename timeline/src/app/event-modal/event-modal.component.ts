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

  /**
   * Metoda zamyka okno i w odpowiedzi przekazuje wydarzenie.
   */
  onSubmit(): void {
    this.dialogRef.close(this.newEvent);
  }

  /**
   * Metoda zamyka okno
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Metoda formatuje date
   * @param date - formatowana data
   * @returns data w postaci gotowej do wyświetlenia
   */
  formatDate(date: Date | null): string {
    if (date !== null) {
      const localDateTime = new Date(date).toLocaleString('en-US', { timeZone: 'Europe/Belgrade' });
      const isoDateTimePlusOneHour = new Date(localDateTime);
      isoDateTimePlusOneHour.setHours(isoDateTimePlusOneHour.getHours() + 1);
      return isoDateTimePlusOneHour.toISOString().substring(0, 10);
    }
  
    return '';
  }

  /**
   * Metoda ustawia datę do wydarzenia i sprawdza poprawność dat.
   * @param event - uzupełniona data
   */
  updateStartDate(event: any): void {
    if (event) {
      this.newEvent.start_date = event;
    }
    this.checkDates();
  }

    /**
   * Metoda ustawia datę od wydarzenia i sprawdza poprawność dat.
   * @param event - uzupełniona data
   */
  updateEndDate(event: any): void {
    if (event) {
      this.newEvent.end_date = event;
    }
    this.checkDates();
  }

  /**
   * Metoda weryfikuje poprawność dat. Sprawdza czy data od > data do.
   */
  checkDates(): void {
    if (this.newEvent.start_date && this.newEvent.end_date) {
      const startDateWithoutTime = new Date(this.newEvent.start_date);
      startDateWithoutTime.setHours(0, 0, 0, 0);
  
      const endDateWithoutTime = new Date(this.newEvent.end_date);
      endDateWithoutTime.setHours(0, 0, 0, 0);
  
      if (startDateWithoutTime > endDateWithoutTime) {
        this.dateError = true;
      } else {
        this.dateError = false;
      }
    } else {
      this.dateError = false;
    }
  }
  

  /**
   * Metoda wywołuje zapisanie zdjęcia w wydarzeniu 
   * @param event - plik z kontrolki
   */
  onImageSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.readAndSetImage(file);
    }
  }

  /**
   * Metoda wczytuje i zapisuje zdjecie w wydarzeniu.
   * @param file - plik ze zdjęciem
   */
  readAndSetImage(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      // e.target.result zawiera dane obrazka w formie base64
      this.newEvent.image = e.target.result;
    };

    reader.readAsDataURL(file);
  }

}
