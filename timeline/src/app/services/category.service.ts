import { Injectable } from '@angular/core';
import { Category } from '../model/category';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[];

  constructor() { 
    this.categories = [
      {
        category_id: 1,
        category_name: 'Przykładowa kategoria 1',
        category_color: 'red',
      },
      {
        category_id: 2,
        category_name: 'Przykładowa kategoria 2',
        category_color: 'blue',
      }
    ]
  }
    

  getEvents(): Observable<Category[]> {
    return of(this.categories);
  }

  editEvent(event: Category): Observable<void> {
    // Implementacja edycji kategorii
    return of();
  }

  deleteEvent(eventId: number): Observable<void> {
    // Implementacja usuwania kategorii
    return of();
  }}
