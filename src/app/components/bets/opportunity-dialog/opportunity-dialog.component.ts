import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IOddModel, IOddResponse } from 'src/app/interfaces/Bet/iodd-model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-opportunity-dialog',
  templateUrl: './opportunity-dialog.component.html',
  styleUrls: ['./opportunity-dialog.component.scss']
})
export class OpportunityDialogComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  @Input({required: true}) event_id !: number
  
  loading: boolean = true
  updating: boolean = false
  odds: IOddModel[] = [] 
  selectedOdds: IOddModel[] = [] 

  constructor( private eventService: EventService, private messageService: MessageService ) {}

  ngOnInit(): void {
    this.eventService.getEventOdds(this.event_id).subscribe({
      next: (response: IOddResponse) => {
        this.odds = response.odds
        this.selectedOdds = response.odds.filter(odd => odd.selected)
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
      }
    });
  }

  update_odds() { 
    this.updating = true
    var ids = this.selectedOdds.map(odd => odd.id)
    this.eventService.setEventOdds(this.event_id, ids).subscribe({
      next: (response: any) => {
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
