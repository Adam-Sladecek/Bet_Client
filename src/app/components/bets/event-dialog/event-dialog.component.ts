import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { IEventModel } from 'src/app/interfaces/Event/ievent-model';
import { IEventResponse } from 'src/app/interfaces/Event/ievent-response';
import { EventService } from 'src/app/services/event.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter();
  @ViewChild('dt1') dt1!: Table;

  private defaultEventSubscription: Subscription
  loading: boolean
  updating: boolean
  events: IEventModel[]
  selectedEvents: IEventModel[]

  constructor( private websocketService: WebSocketService, 
    private messageService: MessageService,
    private eventService: EventService ) {
    this.loading = true
    this.updating = false
    this.events = []
    this.selectedEvents = []
    this.defaultEventSubscription = this.websocketService.defaultEventObservable.subscribe({
      next: (response: IEventModel[]) => {
        this.events = response
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
      }
    });
  }

  ngOnInit(): void {
    this.get_events()
  }

  ngOnDestroy(): void {
    this.defaultEventSubscription.unsubscribe();
  }

  update_events() { 

  }

  getImageRoute(sbName: number): string {
    switch (sbName) {
      case 1:
        return "assets/layout/images/sportsbooks/nike.png"
      case 2:
        return "assets/layout/images/sportsbooks/tipsport.png"
      default:
        return ""
    }
  }

  filterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value !== null) {
      this.dt1.filterGlobal(input.value, 'contains');
    }
  }

  private get_events() { 
    this.eventService.getDefaultEvents().subscribe({
      next: (response: IEventResponse) => {
        this.events = response.events
        this.selectedEvents = response.events.filter(event => event.selected)
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
      }
    });
  }
}
