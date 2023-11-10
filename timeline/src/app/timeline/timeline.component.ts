import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isBefore, isAfter, isSameDay } from 'date-fns';
import { TimelineEvent } from '../model/timeline-event'

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  title = 'Timeline';
  events: TimelineEvent[];
  filteredEvents: TimelineEvent[];
  startDate: Date | null;
  endDate: Date | null;
  sortBy: string;
  displayedColumns: string[] = ['event_id', 'event_name', 'start_date', 'end_date', 'description', 'category_id'];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource: MatTableDataSource<TimelineEvent>;

  constructor() {
    this.startDate = null;
    this.endDate = null;
    this.sortBy = 'event_id';

    this.events = [
      {
        event_id: 1,
        event_name: 'Przykładowe wydarzenie 1',
        start_date: new Date('2023-11-06'),
        end_date: new Date('2023-11-07'),
        description: 'To jest przykładowe wydarzenie 1',
        image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABtW3KmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNpiZGBi7EZKlMyyf07I1VW9AgBsfH3R/AgTnPrGDNAAd4XJhBpZCVogtRAcXESI9HUwpvSYsG/QwLwEJKHtG/AKiB5JmM8Pc+3C8wNPDfQgZ0Ab1UwI8g3UDEcgjKPyiBFxPfT1IDhSAFbEMv0CU0DkHoHqMC6/MPWAoJbAzAAsmzZ5UMVAwMDwMgsNrwJ9TQGkIYzE1Y5hOp7AMkDqHkMmB0wZArvMAz4yPI2E9kCoBz4E2F/F/hq7D3YAjCw6BuLgANAsw6AmJE1kFYF80nNBNYiABYwvTsB3aMA+3+R3IdD4/1EGyJbAhgAjcA3moQa7fU2WYwz7YAhmM+eMbNjBZgAzM6gS0YzF0sMDzALqDWm/JePtpzS3YAKVcAm2MFZ8rM8dS6AjcLqEJnBzDoA7sD+LwLQD7WkDIUWxBpYCMgCjMgjkz7S3AOgXABZqFw5fSdQJoDLWdAjqE/c4gJnBAyS8BUbJ8C5hEBOhLRA7gHoSjXAAnp9mLQPXbSAEmnEXjAY2/F1DBgZgDfA1EgF2jMgBozE2DzZ9UMGAhABhAlEQ2HnHaIdU+3Xw+KWA4wgMQkqHJFoGnCtQsBgSMJ5UkCbhuB2AMq/9fgXIGswdG0AZG2AKLWdmBpmVw8KlWM4QyHoARvK8gmUaZAyiFg4JlXiLKMqAM6pAjLGSCwACnZzQbGaGc8BwBaBkj0FVJOGhFf2Gc8gB+gTMHMCg5Hohg3Q1EFVCfTFU4hgQYJLCO2vO4ghIAzIAJBXzJG4hgjcSjY2NVDzHA9RkMxkGc+wiYgRiY8YDjDCwgWiAOwA+xLoqXx1AAAAAElFTkSuQmCC',
        category_id: 1,
      },
      {
        event_id: 2,
        event_name: 'Przykładowe wydarzenie 2',
        start_date: new Date('2023-11-08'),
        end_date: new Date('2023-11-10'),
        description: 'To jest przykładowe wydarzenie 2',
        image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABtW3KmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNpiZGBi7EZKlMyyf07I1VW9AgBsfH3R/AgTnPrGDNAAd4XJhBpZCVogtRAcXESI9HUwpvSYsG/QwLwEJKHtG/AKiB5JmM8Pc+3C8wNPDfQgZ0Ab1UwI8g3UDEcgjKPyiBFxPfT1IDhSAFbEMv0CU0DkHoHqMC6/MPWAoJbAzAAsmzZ5UMVAwMDwMgsNrwJ9TQGkIYzE1Y5hOp7AMkDqHkMmB0wZArvMAz4yPI2E9kCoBz4E2F/F/hq7D3YAjCw6BuLgANAsw6AmJE1kFYF80nNBNYiABYwvTsB3aMA+3+R3IdD4/1EGyJbAhgAjcA3moQa7fU2WYwz7YAhmM+eMbNjBZgAzM6gS0YzF0sMDzALqDWm/JePtpzS3YAKVcAm2MFZ8rM8dS6AjcLqEJnBzDoA7sD+LwLQD7WkDIUWxBpYCMgCjMgjkz7S3AOgXABZqFw5fSdQJoDLWdAjqE/c4gJnBAyS8BUbJ8C5hEBOhLRA7gHoSjXAAnp9mLQPXbSAEmnEXjAY2/F1DBgZgDfA1EgF2jMgBozE2DzZ9UMGAhABhAlEQ2HnHaIdU+3Xw+KWA4wgMQkqHJFoGnCtQsBgSMJ5UkCbhuB2AMq/9fgXIGswdG0AZG2AKLWdmBpmVw8KlWM4QyHoARvK8gmUaZAyiFg4JlXiLKMqAM6pAjLGSCwACnZzQbGaGc8BwBaBkj0FVJOGhFf2Gc8gB+gTMHMCg5Hohg3Q1EFVCfTFU4hgQYJLCO2vO4ghIAzIAJBXzJG4hgjcSjY2NVDzHA9RkMxkGc+wiYgRiY8YDjDCwgWiAOwA+xLoqXx1AAAAAElFTkSuQmCC',
        category_id: 2,
      },
      {
        event_id: 3,
        event_name: 'Przykładowe wydarzenie 3',
        start_date: new Date('2023-12-08'),
        end_date: new Date('2023-12-10'),
        description: 'To jest przykładowe wydarzenie 2',
        image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABtW3KmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNpiZGBi7EZKlMyyf07I1VW9AgBsfH3R/AgTnPrGDNAAd4XJhBpZCVogtRAcXESI9HUwpvSYsG/QwLwEJKHtG/AKiB5JmM8Pc+3C8wNPDfQgZ0Ab1UwI8g3UDEcgjKPyiBFxPfT1IDhSAFbEMv0CU0DkHoHqMC6/MPWAoJbAzAAsmzZ5UMVAwMDwMgsNrwJ9TQGkIYzE1Y5hOp7AMkDqHkMmB0wZArvMAz4yPI2E9kCoBz4E2F/F/hq7D3YAjCw6BuLgANAsw6AmJE1kFYF80nNBNYiABYwvTsB3aMA+3+R3IdD4/1EGyJbAhgAjcA3moQa7fU2WYwz7YAhmM+eMbNjBZgAzM6gS0YzF0sMDzALqDWm/JePtpzS3YAKVcAm2MFZ8rM8dS6AjcLqEJnBzDoA7sD+LwLQD7WkDIUWxBpYCMgCjMgjkz7S3AOgXABZqFw5fSdQJoDLWdAjqE/c4gJnBAyS8BUbJ8C5hEBOhLRA7gHoSjXAAnp9mLQPXbSAEmnEXjAY2/F1DBgZgDfA1EgF2jMgBozE2DzZ9UMGAhABhAlEQ2HnHaIdU+3Xw+KWA4wgMQkqHJFoGnCtQsBgSMJ5UkCbhuB2AMq/9fgXIGswdG0AZG2AKLWdmBpmVw8KlWM4QyHoARvK8gmUaZAyiFg4JlXiLKMqAM6pAjLGSCwACnZzQbGaGc8BwBaBkj0FVJOGhFf2Gc8gB+gTMHMCg5Hohg3Q1EFVCfTFU4hgQYJLCO2vO4ghIAzIAJBXzJG4hgjcSjY2NVDzHA9RkMxkGc+wiYgRiY8YDjDCwgWiAOwA+xLoqXx1AAAAAElFTkSuQmCC',
        category_id: 2,
      }
    ];
    this.filteredEvents = [...this.events];
    this.dataSource = new MatTableDataSource<TimelineEvent>(this.filteredEvents);
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.filteredEvents);
    this.dataSource.sort = this.sort;
  }

  editEvent(event: TimelineEvent): void {
    // Implementacja edycji wydarzenia
  }

  deleteEvent(eventId: number): void {
    // Implementacja usunięcia wydarzenia
  }

  filterByDate(): void {
    if (this.startDate !== null && this.endDate !== null) {
      this.filteredEvents = this.events.filter(event => {
        const eventDateStart = new Date(event.start_date);
        const eventDateEnd = new Date(event.end_date);
        return (isBefore(eventDateEnd, this.endDate!) || isSameDay(eventDateEnd, this.endDate!)) 
            && (isAfter(eventDateStart, this.startDate!) || isSameDay(eventDateStart, this.startDate!));
      });
    } else {
      this.filteredEvents = this.events;
    }
    this.dataSource.data = this.filteredEvents;
  }

  addStartDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    this.filterByDate();
  }
  
  addEndDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    this.filterByDate();
  }
}
