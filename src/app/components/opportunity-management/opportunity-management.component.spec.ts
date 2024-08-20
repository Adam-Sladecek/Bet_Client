import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';

import { OpportunityFactoryComponent } from '../opportunity-factory/opportunity-factory.component';
import { OpportunityManagementComponent } from './opportunity-management.component';
import { OpportunityChildrenComponent } from '../opportunity-children/opportunity-children.component';
import { OpportunityMarketsComponent } from '../opportunity-markets/opportunity-markets.component';

describe('OpportunityManagementComponent', () => {
  let component: OpportunityManagementComponent;
  let fixture: ComponentFixture<OpportunityManagementComponent>;
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        ProgressSpinnerModule,
        HttpClientTestingModule,
        TabViewModule,
        DropdownModule,
        FormsModule,
        ToastModule
      ],
      declarations: [
        OpportunityManagementComponent, 
        OpportunityFactoryComponent, 
        OpportunityChildrenComponent, 
        OpportunityMarketsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.activeIndex).toEqual(0);
  });
});
