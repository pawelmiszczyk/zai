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

  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.loadEvents();
    });
  }
  
}