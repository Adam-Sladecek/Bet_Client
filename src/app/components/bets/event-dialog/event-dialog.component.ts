import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { TaskState } from 'src/app/enums/task-state';
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
  @ViewChild('dt1') dt1!: Table;

  private defaultEventSubscription: Subscription
  loading: boolean
  updating: boolean
  importing: boolean
  events: IEventModel[]
  selectedEvents: IEventModel[]

  constructor( private websocketService: WebSocketService, 
    private messageService: MessageService,
    private eventService: EventService ) {
    this.loading = true
    this.updating = false
    this.importing = false
    this.events = []
    this.selectedEvents = []
    this.defaultEventSubscription = this.websocketService.defaultEventObservable.subscribe({
      next: (state: TaskState) => {
        if (state == TaskState.RUNNING){ 
          this.importing = true
        }
        else if (state == TaskState.CLOSED) { 
          this.get_events(true)
        }
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
    this.updating = true
    var ids = this.selectedEvents.map(event => event.id)
    this.eventService.setDefaultEvents(ids).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Events updated." })
        this.updating = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
      }
    });
  }

  getSbImageRoute(sbId: number): string {
    return this.eventService.getSbImageRoute(sbId);
  }

  getSportImageRoute(sportId: number): string {
    return this.eventService.getSportImageRoute(sportId);
  }

  filterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value !== null) {
      this.dt1.filterGlobal(input.value, 'contains');
    }
  }

  import() { 
    this.websocketService.sendMessage({ action: 'import' });
  }

  private get_events(from_import: boolean = false) { 
    this.eventService.getDefaultEvents().subscribe({
      next: (response: IEventResponse) => {
        this.events = response.events
        this.selectedEvents = response.events.filter(event => event.selected)
        this.loading = false
        if(from_import)
          this.importing = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
      }
    });
  }
}
