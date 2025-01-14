import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { SOCKET_CONSTANTS } from 'src/app/constants/app.constants';
import { IPriceModel, IPriceResponse } from 'src/app/interfaces/Bet/iprice-model';
import { EventService } from 'src/app/services/event.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-opportunity-dialog',
  templateUrl: './opportunity-dialog.component.html',
  styleUrls: ['./opportunity-dialog.component.scss']
})
export class OpportunityDialogComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  @Input({required: true}) event_pk !: number
  
  loading: boolean = true
  updating: boolean = false
  prices: IPriceModel[] = [] 
  selectedPrices: IPriceModel[] = [] 

  constructor( private eventService: EventService, 
    private messageService: MessageService,
    private websocketService: WebSocketService ) {}

  ngOnInit(): void {
    this.eventService.getEventPrices(this.event_pk).subscribe({
      next: (response: IPriceResponse) => {
        this.prices = response.prices
        this.selectedPrices = response.prices.filter(price => price.selected)
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
      }
    });
  }

  update_prices() { 
    this.updating = true
    var ids = this.selectedPrices.map(price => price.id)
    this.eventService.setEventPrices(this.event_pk, ids).subscribe({
      next: (response: any) => {
        this.websocketService.sendMessage({ action: SOCKET_CONSTANTS.SENDALL });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Opporunities updated." })
        this.updating = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
      }
    });
  }

  filterGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value !== null) {
      this.dt1.filterGlobal(input.value, 'contains');
    }
  }
}
