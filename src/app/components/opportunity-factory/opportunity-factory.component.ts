import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { IUnassignedOpportunity } from 'src/app/interfaces/iunassigned-opportunity';
import { IUnassignedOpportunityResponse } from 'src/app/interfaces/iunassigned-opportunity-response';
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
  allSportsBooks!: string[]
  selectedSportsbook!: string[]

  allOpportunities!: IUnassignedOpportunityResponse
  firstOpportunities!: IUnassignedOpportunity[]
  secondOpportunities!: IUnassignedOpportunity[]
  
  firstSelectedOpp: IUnassignedOpportunity[]
  secondSelectedOpp: IUnassignedOpportunity[]
  constructor( private oppService: OpportunityService, private messageService: MessageService) {
    this.loading = true
    this.linking = false
    this.firstSelectedOpp = [] 
    this.secondSelectedOpp = [] 
  }

  ngOnInit(): void {
    this.getOpportunities()
  }

  sbChange(event: DropdownChangeEvent) { 
    this.firstOpportunities = this.allOpportunities.data[event.value]
    this.secondOpportunities = []
    for (const [key, value] of Object.entries(this.allOpportunities.data)) {
      if (key == event.value) continue
      this.secondOpportunities = this.secondOpportunities.concat(value.filter(val => val.sportsbook == event.value))
    }
    this.firstSelectedOpp = [] 
    this.secondSelectedOpp = [] 
  }

  showSecondOpp(opp: IUnassignedOpportunity) {
    return this.firstSelectedOpp.length>0 && this.firstSelectedOpp[0].sport == opp.sport && this.allOpportunities.data[this.firstSelectedOpp[0].sportsbook].includes(opp)
  }

  pickFirstOpp(opp: IUnassignedOpportunity) { 
    this.firstSelectedOpp = [opp]
    this.secondSelectedOpp = []
  }

  pickSecondOpp(opp: IUnassignedOpportunity) { 
    this.secondSelectedOpp = [opp]
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

  link () {
    this.linking = true
    const body = {opportunities: [this.firstSelectedOpp[0], this.secondSelectedOpp[0]]}
    this.oppService.setOpportunityLink(body).subscribe({
      next: (data) => {
        for (const [key, value] of Object.entries(this.allOpportunities.data)) {
          this.allOpportunities.data[key] = value.filter(val => val.opportunity_id != this.firstSelectedOpp[0].opportunity_id && val.opportunity_id != this.secondSelectedOpp[0].opportunity_id)
        }
        this.sbChange({value: this.secondSelectedOpp[0].sportsbook} as DropdownChangeEvent)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message })
        this.linking = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
        this.linking = false
      }
    })
  }

  private getOpportunities() { 
    this.oppService.getOpportunities().subscribe({
      next: (response: IUnassignedOpportunityResponse) => {
        this.allOpportunities = response
        this.allSportsBooks = Object.keys(response.data)
        this.loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message ?? err.message})
        console.error(err)
      }
    })
  }
}
