import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OpportunityChildrenComponent } from './opportunity-children.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

describe('OpportunityChildrenComponent', () => {
  let component: OpportunityChildrenComponent;
  let fixture: ComponentFixture<OpportunityChildrenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        HttpClientTestingModule,
        ProgressSpinnerModule,
        FormsModule,
        ToastModule
      ],
      declarations: [OpportunityChildrenComponent],
      providers: [OpportunityService, MessageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
