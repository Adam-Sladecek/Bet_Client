import { AbstractType, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IMarket } from 'src/app/interfaces/Opportunity/imarket';
import { IMarketResponse } from 'src/app/interfaces/Opportunity/imarket-response';
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

  markets_dict: {
    [key: number]: IMarket[]
  } = {}

  newMarketName: {
    [key: number]: string
  } = {}

  constructor( 
    private oppService: OpportunityService, 
    private messageService: MessageService, 
    private eventService: EventService) {
    this.loading = true
  }

  ngOnInit(): void {
    this.getMarkets()
  }

  sportbookIds(): number[] {
    return Object.keys(this.markets_dict).map(Number)
  }

  getSbImageRoute(sbId: number): string {
    return this.eventService.getSbImageRoute(sbId);
  }

  addMarket(name: string, sbid: number) { 
    if (!name) return
    this.updating = true
    this.oppService.addMarket(name, sbid).subscribe({
      next: (market: IMarket) => {
        this.markets_dict[sbid].push(market)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Market added." })
        this.updating = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
      }
    })
  }

  removeMarket(pk: number, sbid: number) { 
    this.updating = true
    this.oppService.removeMarket(pk).subscribe({
      next: (response: any) => {
        this.markets_dict[sbid] = this.markets_dict[sbid].filter(m => m.id !== pk)
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
        this.markets_dict = response.markets
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
      }
    })
  }
}
