import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IMarketResponse } from 'src/app/interfaces/Opportunity/imarket-response';
import { ISbWithMarkets } from 'src/app/interfaces/Opportunity/isb-with-markets';
import { EventService } from 'src/app/services/event.service';
import { OpportunityService } from 'src/app/services/opportunity.service';

@Component({
  selector: 'app-opportunity-markets',
  templateUrl: './opportunity-markets.component.html',
  styleUrls: ['./opportunity-markets.component.scss'],
  providers: [MessageService]
})
export class OpportunityMarketsComponent implements OnInit{
  loading: boolean = true
  updating: boolean = false

  sbsWithMarkets: ISbWithMarkets[] = []
  constructor( 
    private oppService: OpportunityService, 
    private messageService: MessageService, 
    private eventService: EventService) {
    this.loading = true
  }

  ngOnInit(): void {
    this.getMarkets()
  }

  getSbImageRoute(sbId: number): string {
    return this.eventService.getSbImageRoute(sbId);
  }

  addMarket(name: string, sbid: number) { 
    if (!name) return
    this.updating = true
    this.oppService.addMarket(name, sbid).subscribe({
      next: (response: IMarketResponse) => {
        this.sbsWithMarkets = response.sb_markets 
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Market added." })
        this.updating = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
      }
    })
  }

  removeMarket(pk: number) { 
    this.updating = true
    this.oppService.removeMarket(pk).subscribe({
      next: (response: IMarketResponse) => {
        this.sbsWithMarkets = response.sb_markets 
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Market deleted." })
        this.updating = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
      }
    })
  }

  private getMarkets() { 
    this.oppService.getMarkets().subscribe({
      next: (response: IMarketResponse) => {
        this.sbsWithMarkets = response.sb_markets 
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
      }
    })
  }
}
