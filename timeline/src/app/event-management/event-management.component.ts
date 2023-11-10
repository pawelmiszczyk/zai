import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { TimelineEvent } from '../model/timeline-event';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {

  events: TimelineEvent[];
  categories: Category[];
  newEvent: TimelineEvent;

  constructor(private eventService: EventService, private categoryService: CategoryService) {
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

  editEvent(eventId: number): void {
    this.newEvent.event_id = eventId;
    this.eventService.editEvent(this.newEvent).subscribe(() => {
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

  deleteEvent(eventId: number): void {
    // Implementacja usuwania wydarzenia
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.loadEvents(); // Odśwież listę po usunięciu
    });
  }
}