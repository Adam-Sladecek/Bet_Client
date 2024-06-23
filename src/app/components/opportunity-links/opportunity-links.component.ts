import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IOpportunityLink, IOpportunityLinkResponse } from 'src/app/interfaces/iopportunity-link-response';
import { IParentOpportunity } from 'src/app/interfaces/iparrent-opportunity';
import { OpportunityService } from 'src/app/services/opportunity.service';

@Component({
  selector: 'app-opportunity-links',
  templateUrl: './opportunity-links.component.html',
  styleUrls: ['./opportunity-links.component.scss'],
  providers: [OpportunityService, MessageService]
})
export class OpportunityLinksComponent {
  loading: boolean
  deleting: boolean
  opportunityLinks: IOpportunityLink[]
  constructor( private oppService: OpportunityService, private messageService: MessageService) {
    this.loading = true
    this.deleting = false
    this.opportunityLinks = []
  }

  ngOnInit(): void {
    this.getLinks()
  }

  deleteLink(parent: IParentOpportunity) {
    this.deleting = true
    this.oppService.deleteLink(parent.id).subscribe({
      next: (response: IOpportunityLinkResponse) => {
        this.opportunityLinks = response.links
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Link deleted." })
        this.deleting = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.deleting = false
      }
    })
  }

  private getLinks() { 
    this.oppService.getLinks().subscribe({
      next: (response: IOpportunityLinkResponse) => {
        this.opportunityLinks = response.links
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.loading = false
      }
    })
  }
}
