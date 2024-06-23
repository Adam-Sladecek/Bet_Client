import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IOpportunity } from 'src/app/interfaces/iopportunity';
import { IOpportunityFactoryResponse } from 'src/app/interfaces/iopportunity-factory-response';
import { IParentOpportunity } from 'src/app/interfaces/iparrent-opportunity';
import { OpportunityService } from 'src/app/services/opportunity.service';

@Component({
  selector: 'app-opportunity-factory',
  templateUrl: './opportunity-factory.component.html',
  styleUrls: ['./opportunity-factory.component.scss'],
  providers: [OpportunityService, MessageService]
})
export class OpportunityFactoryComponent implements OnInit{
  loading: boolean
  linking: boolean
  canCreateParents: boolean
  canLinkChild: boolean
  parents!: IParentOpportunity[]
  opportunities!: IOpportunity[]
  
  firstSelectedOpp: IOpportunity[] | IParentOpportunity[]
  secondSelectedOpp: IOpportunity[]
  constructor( private oppService: OpportunityService, private messageService: MessageService) {
    this.loading = true
    this.linking = false
    this.canCreateParents = false
    this.canLinkChild = false
    this.firstSelectedOpp = [] 
    this.secondSelectedOpp = [] 
  }

  ngOnInit(): void {
    this.getOpportunities()
  }

  pickParent(parent: IParentOpportunity) { 
    this.canCreateParents = false
    this.canLinkChild = false
    this.firstSelectedOpp = [parent]
    this.secondSelectedOpp = []
  }

  pickOpportunity(opp: IOpportunity) { 
    this.canCreateParents = false
    this.canLinkChild = false
    if (this.secondSelectedOpp.length == 0 && this.firstSelectedOpp.length == 1) {
      this.secondSelectedOpp = [opp]
      this.canLinkChild = true
      return
    }

    if (this.secondSelectedOpp.length == 0) {
      this.secondSelectedOpp = [opp]
      return
    }

    if (this.firstSelectedOpp.length == 0) {
      this.firstSelectedOpp = [opp]
      this.canCreateParents = true
      return
    }

    if (this.firstSelectedOpp.length == 1) {
      this.firstSelectedOpp = []
      this.secondSelectedOpp = [opp]
      return
    }
  }
  
  clear(table: Table) {
    table.clear();
  }

  addLink () {
    this.canCreateParents = false
    this.canLinkChild = false
    this.linking = true
    const body = {opportunities: [this.firstSelectedOpp[0], this.secondSelectedOpp[0]]}
    this.oppService.addOpportunityLink(body).subscribe({
      next: (response: IOpportunityFactoryResponse) => {
        this.firstSelectedOpp = [] 
        this.secondSelectedOpp = [] 
        this.parents = response.parents 
        this.opportunities = response.opportunities
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Link added." })
        this.linking = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.linking = false
      }
    })
  }

  addChild () {
    this.canCreateParents = false
    this.canLinkChild = false
    this.linking = true
    this.oppService.addChild(this.firstSelectedOpp[0].id, this.secondSelectedOpp[0].id).subscribe({
      next: (response: IOpportunityFactoryResponse) => {
        this.firstSelectedOpp = [] 
        this.secondSelectedOpp = [] 
        this.parents = response.parents 
        this.opportunities = response.opportunities
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Child added." })
        this.linking = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.linking = false
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
  private getOpportunities() { 
    this.oppService.getOpportunitiesToLink().subscribe({
      next: (response: IOpportunityFactoryResponse) => {
        this.parents = response.parents 
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
