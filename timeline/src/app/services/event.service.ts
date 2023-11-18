import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimelineEvent } from '../model/timeline-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: TimelineEvent[];
  counterOfEvents: number;

  // TODO do zrobienia wczytywanie obrazkow z assets/images zamiast nulli w konstruktorze
  constructor() { 
    this.events = [
      {
        event_id: 1,
        event_name: 'Międzynarodowe warsztaty',
        start_date: new Date('11-05-2023'),
        end_date: new Date('11-07-2023'),
        description: 'W tych dniach odbyły się międzynarodowe warsztaty w zarządzaniu projektami informatycznymi.',
        image: null,
        category_id: 1,
      },
      {
        event_id: 2,
        event_name: 'Targi pracy',
        start_date: new Date('11-03-2023'),
        end_date: new Date('11-03-2023'),
        description: 'Firma zatrudniła 30 nowych specjalistów IT.',
        image: null,
        category_id: 2,
      },
      {
        event_id: 3,
        event_name: 'Udany przetarg',
        start_date: new Date('11-10-2023'),
        end_date: new Date('11-10-2023'),
        description: 'Firma podpisała umowę wartą 10 milionów złotych.',
        image: null,
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


