import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimelineEvent } from '../model/timeline-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: TimelineEvent[];

  constructor() { 
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
  }

  getEvents(): Observable<TimelineEvent[]> {
    return of(this.events);
  }

  editEvent(event: TimelineEvent): Observable<void> {
    // Implementacja edycji wydarzenia
    return of();
  }

  deleteEvent(eventId: number): Observable<void> {
    // Implementacja usuwania wydarzenia
    return of();
  }
}

