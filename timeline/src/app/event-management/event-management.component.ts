import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { TimelineEvent } from '../model/timeline-event';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category';
import { MatDialog } from '@angular/material/dialog';
import { EventModalComponent } from '../event-modal/event-modal.component';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {

  events: TimelineEvent[];
  categories: Category[];

  constructor(private dialog: MatDialog, private eventService: EventService, private categoryService: CategoryService) {
    this.events = [];
    this.categories = [];
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
  }

  /**
   * Metoda wczytuje wydarzenia wywołując metode getEvents serwisu wydarzeń.
   */
  loadEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

  /**
   * Metoda wczytuje kategorię wywołując metode getCategories serwisu kategorii.
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  /**
   * Metoda otwiera okno modalne służące do dodania nowego wydarzenia. Po zamknięciu okna modalnego dodawane jest nowe wydarzenie z użyciem serwisu dodania wydarzenia.
   */
  openAddEventModal(): void {
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '400px', 
      data: { categories: this.categories, title: "Dodaj nowe wydarzenie", button_name: "Dodaj" }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.addEvent(result);
        this.loadEvents();
      }
    });
  }

  /**
   * Metoda otwiera okno modalne służące do edycji wydarzenia. Po zamknięciu okna modalnego edytowane jest wydarzenie z użyciem serwisu edycji wydarzenia.
   * @param event - edytowane wydarzenie
   */
  openEditEventModal(event: TimelineEvent): void {
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '400px', 
      data: { categories: this.categories, event: event, title: "Modyfikuj wydarzenie", button_name: "Modyfikuj" }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.editEvent(result);
        this.loadEvents();
      }
    });
  }

  /**
   * Metoda wywołuje metode serwisu wydarzenia, która usuwa wydarzenie.
   * @param eventId - identyfikator wydarzenia
   */
  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.loadEvents();
    });
  }
  
}