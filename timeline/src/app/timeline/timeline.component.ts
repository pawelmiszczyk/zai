import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isBefore, isAfter, isSameDay } from 'date-fns';
import { TimelineEvent } from '../model/timeline-event'
import { EventService } from '../services/event.service';
import { Category } from '../model/category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  title = 'Timeline';
  events: TimelineEvent[];
  filteredEvents: TimelineEvent[];
  categories: Category[];
  categoryMap: Map<number, string> = new Map();
  startDate: Date | null;
  endDate: Date | null;
  sortBy: string;
  displayedColumns: string[] = ['event_name', 'start_date', 'end_date', 'description', 'category_name', 'image'];
  selectedCategory: number | null;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource: MatTableDataSource<TimelineEvent>;

  constructor(private EventService: EventService, private CategoryService: CategoryService) {
    this.startDate = null;
    this.endDate = null;
    this.selectedCategory = null;
    this.sortBy = 'event_id';
    this.events = [];
    this.filteredEvents = [...this.events];
    this.dataSource = new MatTableDataSource<TimelineEvent>(this.filteredEvents);
    this.categories = [];
  }

  ngOnInit(): void {
    this.EventService.getEvents().subscribe((events) => {
      this.events = events;
      this.filteredEvents = [...this.events];
      this.dataSource = new MatTableDataSource<TimelineEvent>(this.filteredEvents);
      this.dataSource.sort = this.sort;
    });
    this.CategoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.categoryMap = new Map(categories.map(category => [category.category_id, category.category_name]));
    });
    this.filterEvents();
    this.sortByStartDate();
  }

  /**
   * Metoda filtruje wydarzenia. Weryfikowane są dwa kryteria - datowe i kategorii. 
   */
  filterEvents(): void {
    if (this.selectedCategory !== null) {
      let filteredEvents = this.events.filter(event => event.category_id === this.selectedCategory);
  
      if (this.startDate !== null && this.endDate !== null) {
        filteredEvents = filteredEvents.filter(event => {
          const eventDateStart = new Date(event.start_date ?? new Date());
          const eventDateEnd = new Date(event.end_date ?? new Date());
          const isAfterStartDate = isAfter(eventDateStart, this.startDate!) || isSameDay(eventDateStart, this.startDate!);
          const isBeforeEndDate = isBefore(eventDateEnd, this.endDate!) || isSameDay(eventDateEnd, this.endDate!);
  
          return isAfterStartDate && isBeforeEndDate;
        });
      }
  
      this.filteredEvents = filteredEvents;
      this.dataSource.data = this.filteredEvents;
      this.sortByStartDate();
    } else {
      if (this.startDate !== null && this.endDate !== null) {
        this.filteredEvents = this.events.filter(event => {
          const eventDateStart = new Date(event.start_date ?? new Date());
          const eventDateEnd = new Date(event.end_date ?? new Date());
          const isAfterStartDate = isAfter(eventDateStart, this.startDate!) || isSameDay(eventDateStart, this.startDate!);
          const isBeforeEndDate = isBefore(eventDateEnd, this.endDate!) || isSameDay(eventDateEnd, this.endDate!);
  
          return isAfterStartDate && isBeforeEndDate;
        });
      } else if (this.startDate !== null) {
        // Filtrowanie tylko po dacie od
        this.filteredEvents = this.events.filter(event => {
          const eventDateStart = new Date(event.start_date ?? new Date());
          return isAfter(eventDateStart, this.startDate!) || isSameDay(eventDateStart, this.startDate!);
        });
      } else if (this.endDate !== null) {
        // Filtrowanie tylko po dacie do
        this.filteredEvents = this.events.filter(event => {
          const eventDateEnd = new Date(event.end_date ?? new Date());
          return isBefore(eventDateEnd, this.endDate!) || isSameDay(eventDateEnd, this.endDate!);
        });
      } else {
        this.filteredEvents = this.events;
      }
  
      this.dataSource.data = this.filteredEvents;
    }
  }
  
  /**
   * Metoda ustawia data od filtru i filtruje wydarzenia
   * @param event - data od filtru
   */
  addStartDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    this.filterEvents();
  }

  /**
   * Metoda ustawia data do filtru i filtruje wydarzenia
   * @param event - data do filtru
   */
  addEndDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    this.filterEvents();
  }

  /**
   * Metoda sortuje wydarzenia po dacie rozpoczęcia wydarzenia dla wydarzeń na osi czasu
   */
  sortByStartDate(): void {
    this.filteredEvents = this.filteredEvents.sort((a, b) =>
      new Date(a.start_date ?? new Date()).getTime() - new Date(b.start_date ?? new Date()).getTime()
    );
  }

  /**
   * Metoda czyści filtry i ponownie ustawia wydarzenia
   */
  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedCategory = null;
    this.filterEvents();
    this.sortByStartDate();    
  }

  /**
   * Metoda zwraca ikone kategorii
   * @param categoryId - identyfikator kategorii
   * @returns ikona kategorii
   */
  getCategoryIcon(categoryId: number): string | null {
    const category = this.categories.find(cat => cat.category_id === categoryId);
    return category ? category.category_icon : null;
}

/**
 * Metoda zwraca kolor kategorii
 * @param categoryId - identyfikator kategorii
 * @returns kolor kategorii
 */
  getCategoryColor(categoryId: number): string | null {
    const category = this.categories.find(cat => cat.category_id === categoryId);
    return category ? category.category_color : null;
}

/**
 * Metoda drukuje oś czasu
 */
printTimeline(): void {
    window.print();
  }

  /**
   * Metoda konwertuje date z formatu długiego do DD-MM-YYYY
   * @param date data do konwersji 
   * @returns data w formacie DD-MM-YYYY
   */
  convertDate(date: string): string {
    const data: Date = new Date(date);
  
    const dzien: number = data.getDate();
    const miesiac: number = data.getMonth() + 1;
    const rok: number = data.getFullYear();
  
    const sformatowanaData: string = `${dzien < 10 ? '0' : ''}${dzien}-${miesiac < 10 ? '0' : ''}${miesiac}-${rok}`;
  
    return sformatowanaData;
  }
  
}