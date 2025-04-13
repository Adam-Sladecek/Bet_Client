import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IOpportunityChildrenResponse, IOpportunityWithParentName } from 'src/app/interfaces/Opportunity/iopportunity-children-response';
import { EventService } from 'src/app/services/event.service';
import { OpportunityService } from 'src/app/services/opportunity.service';

@Component({
  selector: 'app-opportunity-children',
  templateUrl: './opportunity-children.component.html',
  styleUrls: ['./opportunity-children.component.scss'],
  providers: [MessageService]
})
export class OpportunityChildrenComponent implements OnInit{
  loading: boolean
  deleting: boolean
  opportunities: IOpportunityWithParentName[] = []

  constructor( 
    private oppService: OpportunityService, 
    private messageService: MessageService,
    private eventService: EventService) {
    this.loading = true
    this.deleting = false
  }

  ngOnInit(): void {
    this.getChildren()
  }

  getSbImageRoute(sbId: number): string {
    return this.eventService.getSbImageRoute(sbId);
  }

  getSportImageRoute(sportId: number): string {
    return this.eventService.getSportImageRoute(sportId);
  }

  changePreferedParent(model: IOpportunityWithParentName) {
    this.deleting = true
    this.oppService.setPreferedOpportunity(model.parent_id, !model.parent_prefered).subscribe({
      next: (response: any) => {
        model.parent_prefered = !model.parent_prefered
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Preferency changed." })
        this.deleting = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
        this.deleting = false
      }
    })
  }

  removeChild(id: number) {
    this.deleting = true
    this.oppService.removeChildFromParent(id).subscribe({
      next: (response: any) => {
        this.opportunities = this.opportunities.filter(opp => opp.opportunity.id != id)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Child removed." })
        this.deleting = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? err.message})
        console.error(err)
        this.deleting = false
      }
    })
  }

  private getChildren() {
    this.oppService.getChildren().subscribe({
      next: (response: IOpportunityChildrenResponse) => {
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
