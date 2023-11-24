import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimelineEvent } from '../model/timeline-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: TimelineEvent[];
  counterOfEvents: number;

  constructor() { 
    /** Mock wydarzeń. Ze względu na problemy z wczytaniem zdjęć z assets/images został dodany dodatkowy mock w pliku html na wyświetlanie zdjęć dla wydarzeń o identyfikatorze 1,2 i 3 */
    this.events = [
      {
        event_id: 1,
        event_name: 'Międzynarodowe warsztaty',
        start_date: new Date('11-05-2023'),
        end_date: new Date('11-07-2023'),
        description: 'W tych dniach odbyły się międzynarodowe warsztaty w zarządzaniu projektami informatycznymi.',
        image: null,
        category_id: 2,
      },
      {
        event_id: 2,
        event_name: 'Targi pracy',
        start_date: new Date('11-03-2023'),
        end_date: new Date('11-03-2023'),
        description: 'Firma zatrudniła 30 nowych specjalistów IT.',
        image: null,
        category_id: 3,
      },
      {
        event_id: 3,
        event_name: 'Udany przetarg',
        start_date: new Date('11-10-2023'),
        end_date: new Date('11-10-2023'),
        description: 'Firma podpisała umowę wartą 10 milionów złotych.',
        image: null,
        category_id: 1,
      }
    ];
    this.counterOfEvents = this.events.length;
  }

  /**
   * Metoda zwraca liste wydarzeń
   * @returns lista wydarzeń
   */
  getEvents(): Observable<TimelineEvent[]> {
    return of(this.events);
  }

  /**
   * Metoda dodaje nowe wydarzenie
   * @param event - wydarzenie
   * @returns informacja o dodaniu wydarzenia
   */
  addEvent(event: TimelineEvent): Observable<String> {
    event.event_id = ++this.counterOfEvents;
    this.events.push(event);
    return of("Wydarzenie zostało dodane.");
  }

  /**
   * Metoda modyfikuje wydarzenie
   * @param modifiedEvent - modyfikowane wydarzenie
   * @returns informacja o modyfikacji wydarzenia
   */
  editEvent(modifiedEvent: TimelineEvent): Observable<String> {
    const index = this.events.findIndex(event => event.event_id === modifiedEvent.event_id);
  
    if (index !== -1) {
      const originalEvent = this.events[index];
      
      // Sprawdź, czy modifiedEvent.image nie jest null ani undefined
      const updatedEvent: TimelineEvent = {
        ...originalEvent,
        ...modifiedEvent,
        image: modifiedEvent.image !== null && modifiedEvent.image !== undefined
          ? modifiedEvent.image
          : originalEvent.image
      };
  
      this.events = this.events.map((event, i) => (i === index ? updatedEvent : event));
  
      return of('Wydarzenie zostało zmodyfikowane');
    } else {
      console.error(`Wydarzenie o identyfikatorze ${modifiedEvent.event_id} nie zostało znalezione.`);
      return of('Błąd: Wydarzenie nie zostało znalezione');
    }
  }

  /**
   * Metoda usuwa wydarzenie
   * @param eventId - identyfikator wydarzenia
   * @returns informacja o usunięciu wydarzenia
   */
  deleteEvent(eventId: number): Observable<String> {
    this.events = this.events.filter(event => event.event_id !== eventId);
    return of("Wydarzenie zostało usunięte.");
  }

  /**
   * Metoda sprawdza czy istnieje wydarzenie z kategorią podaną jako argument
   * @param categoryId - identyfikator kategorii
   * @returns czy istnieje wydarzenie z kategoria - true/false
   */
  isExistsEventAndCategory(categoryId: number) {
    const index = this.events.findIndex(event => event.category_id === categoryId);
    return (index === -1);
  }

}
