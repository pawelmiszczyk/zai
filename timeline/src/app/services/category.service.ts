import { Injectable } from '@angular/core';
import { Category } from '../model/category';
import { Observable, of } from 'rxjs';
import { EventService } from '../services/event.service';
import { PrimeIcons } from "primeng/api"; 

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[];
  counterOfCategories: number;

  constructor(private eventService: EventService) { 
    this.categories = [
      {
        category_id: 1,
        category_name: 'Sukces',
        category_color: '#F0F00F',
        category_icon: PrimeIcons.DOLLAR
      },
      {
        category_id: 2,
        category_name: 'Jednodniowe',
        category_color: '#0F58F8',
        category_icon: PrimeIcons.CLOUD
      }
    ];
    this.counterOfCategories = this.categories.length;
  }
    

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  addCategory(category: Category): Observable<String> {
    category.category_id = ++this.counterOfCategories;
    this.categories.push(category);
    return of("Kategoria została dodane.");
  }

  editCategory(modifiedCategory: Category): Observable<String> {
    const index = this.categories.findIndex(category => category.category_id === modifiedCategory.category_id);
    if (index !== -1) {
      this.categories = this.categories.map((category, i) => (i === index ? modifiedCategory : category));
      return of('Kategoria została zmodyfikowana');
    } else {
      console.error(`Kategoria o identyfikatorze ${modifiedCategory.category_id} nie została znaleziona.`);
      return of('Błąd: Kategoria nie została znaleziona');
    } 
  }

  deleteCategory(categoryId: number): Observable<String> {
    if (this.eventService.isExistsEventAndCategory(categoryId)) {
      this.categories = this.categories.filter(category => category.category_id !== categoryId);
      return of("Kategoria została usunięta.");
    } else {
      return of("Kategoria nie została usunięta.");
    }
  }
}
