import { Component } from '@angular/core';
import { OpportunityService } from 'src/app/services/opportunity.service';

@Component({
  selector: 'app-opportunity-links',
  templateUrl: './opportunity-links.component.html',
  styleUrls: ['./opportunity-links.component.scss'],
  providers: [OpportunityService]
})
export class OpportunityLinksComponent {
  loading: boolean
  
  constructor( private oppService: OpportunityService) {
    this.loading = true
  }

  ngOnInit(): void {
    this.getLinks()
  }

  getLinks() { 
    this.loading = false
  }
}
