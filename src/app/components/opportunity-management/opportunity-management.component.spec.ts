import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpportunityManagementComponent } from './opportunity-management.component';
import { TabViewModule } from 'primeng/tabview';
import { OpportunityFactoryComponent } from '../opportunity-factory/opportunity-factory.component';
import { OpportunityLinksComponent } from '../opportunity-links/opportunity-links.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

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
      declarations: [OpportunityManagementComponent, OpportunityFactoryComponent, OpportunityLinksComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // function tests

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.activeIndex).toEqual(0);
  });
});
