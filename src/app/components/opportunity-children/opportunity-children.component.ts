import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IOpportunityChildrenResponse, IOpportunityWithParentName } from 'src/app/interfaces/iopportunity-children-response';
import { OpportunityService } from 'src/app/services/opportunity.service';

@Component({
  selector: 'app-opportunity-children',
  templateUrl: './opportunity-children.component.html',
  styleUrls: ['./opportunity-children.component.scss'],
  providers: [OpportunityService, MessageService]
})
export class OpportunityChildrenComponent implements OnInit{
  loading: boolean
  deleting: boolean
  opportunities: IOpportunityWithParentName[]

  constructor( private oppService: OpportunityService, private messageService: MessageService) {
    this.loading = true
    this.deleting = false
    this.opportunities = []
  }

  ngOnInit(): void {
    this.getChildren()
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

  removeChild(id: number) {
    this.deleting = true
    this.oppService.removeChildFromParent(id).subscribe({
      next: (response: IOpportunityChildrenResponse) => {
        this.opportunities = response.opportunities
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Child removed." })
        this.deleting = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
      }
    })
  }
}
