import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IOpportunity } from 'src/app/interfaces/Opportunity/iopportunity';
import { IOpportunityFactoryResponse } from 'src/app/interfaces/Opportunity/iopportunity-factory-response';
import { EventService } from 'src/app/services/event.service';
import { OpportunityService } from 'src/app/services/opportunity.service';

@Component({
  selector: 'app-opportunity-factory',
  templateUrl: './opportunity-factory.component.html',
  styleUrls: ['./opportunity-factory.component.scss'],
  providers: [MessageService]
})
export class OpportunityFactoryComponent implements OnInit {
  loading: boolean
  linking: boolean
  canLinkChild: boolean
  parents!: IOpportunity[]
  opportunities!: IOpportunity[]
  
  selectedParent: IOpportunity[]
  selectedOpp: IOpportunity[]
  constructor( 
    private oppService: OpportunityService, 
    private messageService: MessageService, 
    private eventService: EventService) {
    this.loading = true
    this.linking = false
    this.canLinkChild = false
    this.selectedParent = [] 
    this.selectedOpp = [] 
  }

  ngOnInit(): void {
    this.getOpportunities()
  }

  pickParent(parent: IOpportunity) { 
    this.selectedParent = [parent]
    this.canLinkChild = this.selectedOpp.length == 1 && this.selectedParent.length == 1 
  }

  pickOpportunity(opp: IOpportunity) { 
    this.selectedOpp = [opp]
    this.canLinkChild = this.selectedOpp.length == 1 && this.selectedParent.length == 1
  }
  
  clear(table: Table) {
    table.clear();
  }

  addChild () {
    this.canLinkChild = false
    this.linking = true
    this.oppService.addChild(this.selectedParent[0].id, this.selectedOpp[0].id).subscribe({
      next: (response: any) => {
        this.opportunities = this.opportunities.filter(opp => opp.id !=this.selectedOpp[0].id)
        this.selectedParent = [] 
        this.selectedOpp = [] 
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Child added." })
        this.linking = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
        this.linking = false
      }
    })
  }

  getSbImageRoute(sbId: number): string {
    return this.eventService.getSbImageRoute(sbId);
  }

  getSportImageRoute(sportId: number): string {
    return this.eventService.getSportImageRoute(sportId);
  }

  private getOpportunities() { 
    this.oppService.getOpportunitiesToLink().subscribe({
      next: (response: IOpportunityFactoryResponse) => {
        this.parents = response.parents 
        this.opportunities = response.opportunities
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
      }
    })
  }
}
