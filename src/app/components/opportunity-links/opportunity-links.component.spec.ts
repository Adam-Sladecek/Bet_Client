import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpportunityLinksComponent } from './opportunity-links.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OpportunityService } from 'src/app/services/opportunity.service';

describe('OpportunityLinksComponent', () => {
  let component: OpportunityLinksComponent;
  let fixture: ComponentFixture<OpportunityLinksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        HttpClientTestingModule,
        ProgressSpinnerModule,
      ],
      declarations: [OpportunityLinksComponent],
      providers: [OpportunityService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // function tests

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
