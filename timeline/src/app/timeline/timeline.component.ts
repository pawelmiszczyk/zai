import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isBefore, isAfter, isSameDay } from 'date-fns';
import { TimelineEvent } from '../model/timeline-event'
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  title = 'Timeline';
  events: TimelineEvent[];
  filteredEvents: TimelineEvent[];
  startDate: Date | null;
  endDate: Date | null;
  sortBy: string;
  displayedColumns: string[] = ['event_id', 'event_name', 'start_date', 'end_date', 'description', 'category_id'];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource: MatTableDataSource<TimelineEvent>;

  constructor(private EventService: EventService) {
    this.startDate = null;
    this.endDate = null;
    this.sortBy = 'event_id';
    this.events = [];
    this.filteredEvents = [...this.events];
    this.dataSource = new MatTableDataSource<TimelineEvent>(this.filteredEvents);
  }

  ngOnInit(): void {
    this.EventService.getEvents().subscribe((events) => {
      this.events = events;
      this.filteredEvents = [...this.events];
      this.dataSource = new MatTableDataSource<TimelineEvent>(this.filteredEvents);
      this.dataSource.sort = this.sort;
    });
  }

  editEvent(event: TimelineEvent): void {
    this.EventService.editEvent(event).subscribe(() => {
      // Aktualizacja danych po edycji
      // this.filterByDate(); // Jeśli potrzebne
    });
  }
  
  deleteEvent(eventId: number): void {
    this.EventService.deleteEvent(eventId).subscribe(() => {
      // Aktualizacja danych po usunięciu
      // this.filterByDate(); // Jeśli potrzebne
    });
  }

  filterByDate(): void {
    if (this.startDate !== null && this.endDate !== null) {
      this.filteredEvents = this.events.filter(event => {
        const eventDateStart = new Date(event.start_date);
        const eventDateEnd = new Date(event.end_date);
        return (isBefore(eventDateEnd, this.endDate!) || isSameDay(eventDateEnd, this.endDate!)) 
            && (isAfter(eventDateStart, this.startDate!) || isSameDay(eventDateStart, this.startDate!));
      });
    } else {
      this.filteredEvents = this.events;
    }
    this.dataSource.data = this.filteredEvents;
  }

  addStartDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    this.filterByDate();
  }
  
  addEndDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    this.filterByDate();
  }
}
