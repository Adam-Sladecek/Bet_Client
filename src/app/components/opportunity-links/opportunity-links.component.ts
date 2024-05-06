import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IOpportunityLinkResponse, IOpportunityLinkResponseDict } from 'src/app/interfaces/iopportunity-link-response-dict';
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
  opportunityLinks: IOpportunityLinkResponse[]
  constructor( private oppService: OpportunityService, private messageService: MessageService) {
    this.loading = true
    this.deleting = false
    this.opportunityLinks = []
  }

  ngOnInit(): void {
    this.getLinks()
  }

  deleteLink(link: IOpportunityLinkResponse) {
    this.deleting = true
    this.oppService.deleteOpportunityLink(link.opportunity_link_id).subscribe({
      next: (response: any) => {
        this.opportunityLinks = this.opportunityLinks.filter(lnk => lnk.opportunity_link_id != link.opportunity_link_id)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message })
        this.deleting = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.deleting = false
      }
    })
  }
  
  getImageRoute(sbName?: string): string {
    switch (sbName) {
      case "Betfair":
        return "assets/layout/images/sportsbooks/betfair.png"
      case "IFortuna":
        return "assets/layout/images/sportsbooks/fortuna.jpg"
      case "Nike":
        return "assets/layout/images/sportsbooks/nike.png"
      case "Tipsport":
        return "assets/layout/images/sportsbooks/tipsport.png"
      case "Tipos":
        return "assets/layout/images/sportsbooks/tipos.png"
      case "Doxxbet":
        return "assets/layout/images/sportsbooks/doxxbet.png"
      default:
        return ""
    }
  }

  private getLinks() { 
    this.oppService.getOpportunityLinks().subscribe({
      next: (response: IOpportunityLinkResponseDict) => {
        this.opportunityLinks = response.data
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
