import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimelineEvent } from '../model/timeline-event';
import { format } from 'date-fns';

const formattedStartDate = format(new Date('Fri Nov 10 2023 14:47:40 GMT+0100 (czas środkowoeuropejski standardowy)'), 'yyyy-MM-dd');
const formattedEndDate = format(new Date('Fri Nov 10 2023 14:47:40 GMT+0100 (czas środkowoeuropejski standardowy)'), 'yyyy-MM-dd');

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: TimelineEvent[];
  counterOfEvents: number;

  constructor() { 
    this.events = [
      {
        event_id: 1,
        event_name: 'Przykładowe wydarzenie 1',
        start_date: new Date('06-11-2023'),
        end_date: new Date('07-11-2023'),
        description: 'To jest przykładowe wydarzenie 1',
        image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABtW3KmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNpiZGBi7EZKlMyyf07I1VW9AgBsfH3R/AgTnPrGDNAAd4XJhBpZCVogtRAcXESI9HUwpvSYsG/QwLwEJKHtG/AKiB5JmM8Pc+3C8wNPDfQgZ0Ab1UwI8g3UDEcgjKPyiBFxPfT1IDhSAFbEMv0CU0DkHoHqMC6/MPWAoJbAzAAsmzZ5UMVAwMDwMgsNrwJ9TQGkIYzE1Y5hOp7AMkDqHkMmB0wZArvMAz4yPI2E9kCoBz4E2F/F/hq7D3YAjCw6BuLgANAsw6AmJE1kFYF80nNBNYiABYwvTsB3aMA+3+R3IdD4/1EGyJbAhgAjcA3moQa7fU2WYwz7YAhmM+eMbNjBZgAzM6gS0YzF0sMDzALqDWm/JePtpzS3YAKVcAm2MFZ8rM8dS6AjcLqEJnBzDoA7sD+LwLQD7WkDIUWxBpYCMgCjMgjkz7S3AOgXABZqFw5fSdQJoDLWdAjqE/c4gJnBAyS8BUbJ8C5hEBOhLRA7gHoSjXAAnp9mLQPXbSAEmnEXjAY2/F1DBgZgDfA1EgF2jMgBozE2DzZ9UMGAhABhAlEQ2HnHaIdU+3Xw+KWA4wgMQkqHJFoGnCtQsBgSMJ5UkCbhuB2AMq/9fgXIGswdG0AZG2AKLWdmBpmVw8KlWM4QyHoARvK8gmUaZAyiFg4JlXiLKMqAM6pAjLGSCwACnZzQbGaGc8BwBaBkj0FVJOGhFf2Gc8gB+gTMHMCg5Hohg3Q1EFVCfTFU4hgQYJLCO2vO4ghIAzIAJBXzJG4hgjcSjY2NVDzHA9RkMxkGc+wiYgRiY8YDjDCwgWiAOwA+xLoqXx1AAAAAElFTkSuQmCC',
        category_id: 1,
      },
      {
        event_id: 2,
        event_name: 'Przykładowe wydarzenie 2',
        start_date: new Date('01-11-2023'),
        end_date: new Date('05-11-2023'),
        description: 'To jest przykładowe wydarzenie 2',
        image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABtW3KmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNpiZGBi7EZKlMyyf07I1VW9AgBsfH3R/AgTnPrGDNAAd4XJhBpZCVogtRAcXESI9HUwpvSYsG/QwLwEJKHtG/AKiB5JmM8Pc+3C8wNPDfQgZ0Ab1UwI8g3UDEcgjKPyiBFxPfT1IDhSAFbEMv0CU0DkHoHqMC6/MPWAoJbAzAAsmzZ5UMVAwMDwMgsNrwJ9TQGkIYzE1Y5hOp7AMkDqHkMmB0wZArvMAz4yPI2E9kCoBz4E2F/F/hq7D3YAjCw6BuLgANAsw6AmJE1kFYF80nNBNYiABYwvTsB3aMA+3+R3IdD4/1EGyJbAhgAjcA3moQa7fU2WYwz7YAhmM+eMbNjBZgAzM6gS0YzF0sMDzALqDWm/JePtpzS3YAKVcAm2MFZ8rM8dS6AjcLqEJnBzDoA7sD+LwLQD7WkDIUWxBpYCMgCjMgjkz7S3AOgXABZqFw5fSdQJoDLWdAjqE/c4gJnBAyS8BUbJ8C5hEBOhLRA7gHoSjXAAnp9mLQPXbSAEmnEXjAY2/F1DBgZgDfA1EgF2jMgBozE2DzZ9UMGAhABhAlEQ2HnHaIdU+3Xw+KWA4wgMQkqHJFoGnCtQsBgSMJ5UkCbhuB2AMq/9fgXIGswdG0AZG2AKLWdmBpmVw8KlWM4QyHoARvK8gmUaZAyiFg4JlXiLKMqAM6pAjLGSCwACnZzQbGaGc8BwBaBkj0FVJOGhFf2Gc8gB+gTMHMCg5Hohg3Q1EFVCfTFU4hgQYJLCO2vO4ghIAzIAJBXzJG4hgjcSjY2NVDzHA9RkMxkGc+wiYgRiY8YDjDCwgWiAOwA+xLoqXx1AAAAAElFTkSuQmCC',
        category_id: 2,
      },
      {
        event_id: 3,
        event_name: 'Przykładowe wydarzenie 3',
        start_date: new Date('01-12-2023'),
        end_date: new Date('10-12-2023'),
        description: 'To jest przykładowe wydarzenie 2',
        image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABtW3KmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNpiZGBi7EZKlMyyf07I1VW9AgBsfH3R/AgTnPrGDNAAd4XJhBpZCVogtRAcXESI9HUwpvSYsG/QwLwEJKHtG/AKiB5JmM8Pc+3C8wNPDfQgZ0Ab1UwI8g3UDEcgjKPyiBFxPfT1IDhSAFbEMv0CU0DkHoHqMC6/MPWAoJbAzAAsmzZ5UMVAwMDwMgsNrwJ9TQGkIYzE1Y5hOp7AMkDqHkMmB0wZArvMAz4yPI2E9kCoBz4E2F/F/hq7D3YAjCw6BuLgANAsw6AmJE1kFYF80nNBNYiABYwvTsB3aMA+3+R3IdD4/1EGyJbAhgAjcA3moQa7fU2WYwz7YAhmM+eMbNjBZgAzM6gS0YzF0sMDzALqDWm/JePtpzS3YAKVcAm2MFZ8rM8dS6AjcLqEJnBzDoA7sD+LwLQD7WkDIUWxBpYCMgCjMgjkz7S3AOgXABZqFw5fSdQJoDLWdAjqE/c4gJnBAyS8BUbJ8C5hEBOhLRA7gHoSjXAAnp9mLQPXbSAEmnEXjAY2/F1DBgZgDfA1EgF2jMgBozE2DzZ9UMGAhABhAlEQ2HnHaIdU+3Xw+KWA4wgMQkqHJFoGnCtQsBgSMJ5UkCbhuB2AMq/9fgXIGswdG0AZG2AKLWdmBpmVw8KlWM4QyHoARvK8gmUaZAyiFg4JlXiLKMqAM6pAjLGSCwACnZzQbGaGc8BwBaBkj0FVJOGhFf2Gc8gB+gTMHMCg5Hohg3Q1EFVCfTFU4hgQYJLCO2vO4ghIAzIAJBXzJG4hgjcSjY2NVDzHA9RkMxkGc+wiYgRiY8YDjDCwgWiAOwA+xLoqXx1AAAAAElFTkSuQmCC',
        category_id: 2,
      }
    ];
    this.counterOfEvents = this.events.length;
  }

  getEvents(): Observable<TimelineEvent[]> {
    return of(this.events);
  }

  addEvent(event: TimelineEvent): Observable<String> {
    event.event_id = ++this.counterOfEvents;
    console.log(event)
    this.events.push(event);
    return of("Wydarzenie zostało dodane.");
  }


  editEvent(modifiedEvent: TimelineEvent): Observable<String> {
    const index = this.events.findIndex(event => event.event_id === modifiedEvent.event_id);
    if (index !== -1) {
      this.events = this.events.map((event, i) => (i === index ? modifiedEvent : event));
      return of('Wydarzenie zostało zmodyfikowane');
    } else {
      console.error(`Wydarzenie o identyfikatorze ${modifiedEvent.event_id} nie zostało znalezione.`);
      return of('Błąd: Wydarzenie nie zostało znalezione');
    }
  }

  deleteEvent(eventId: number): Observable<String> {
    this.events = this.events.filter(event => event.event_id !== eventId);
    return of("Wydarzenie zostało usunięte.");
  }

  isExistsEventAndCategory(categoryId: number) {
    const index = this.events.findIndex(event => event.category_id === categoryId);
    return (index === -1);
  }
}

