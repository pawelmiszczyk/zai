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
  newEvent: TimelineEvent;

  constructor(private dialog: MatDialog, private eventService: EventService, private categoryService: CategoryService) {
    this.events = [];
    this.categories = [];
    this.newEvent = {
      event_id: 0,
      event_name: '',
      start_date: new Date(),
      end_date: new Date(),
      description: '',
      image_url: '',
      category_id: 0
    };
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  addEvent(): void {
    this.eventService.addEvent(this.newEvent).subscribe(() => {
      this.loadEvents(); // Odśwież listę po dodaniu
      // Zresetuj formularz
      this.newEvent = {
        event_id: 0,
        event_name: '',
        start_date: new Date(),
        end_date: new Date(),
        description: '',
        image_url: '',
        category_id: 0
      };
    });
  }

  openEditEventModal(event: TimelineEvent): void {
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '400px', 
      data: { categories: this.categories, event: event, title: "Modyfikuj wydarzenie", button_name: "Modyfikuj" }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.editEvent(result);
      }
    });
  }

  deleteEvent(eventId: number): void {
    // Implementacja usuwania wydarzenia
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.loadEvents(); // Odśwież listę po usunięciu
    });
  }

  openAddEventModal(): void {
    const dialogRef = this.dialog.open(EventModalComponent, {
      width: '400px', 
      data: { categories: this.categories, title: "Dodaj nowe wydarzenie", button_name: "Dodaj" }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.addEvent(result);
      }
    });
  }
  
}