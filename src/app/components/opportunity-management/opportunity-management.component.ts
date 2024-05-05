import { Component } from '@angular/core';

@Component({
  selector: 'app-opportunity-management',
  templateUrl: './opportunity-management.component.html',
  styleUrls: ['./opportunity-management.component.scss']
})
export class OpportunityManagementComponent {
    activeIndex: number;
    constructor() {
      this.activeIndex = 0
    }
}
