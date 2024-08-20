import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

import { OpportunityChildrenComponent } from './opportunity-children.component';
import { OpportunityService } from 'src/app/services/opportunity.service';

describe('OpportunityChildrenComponent', () => {
  let component: OpportunityChildrenComponent;
  let fixture: ComponentFixture<OpportunityChildrenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        HttpClientTestingModule,
        ProgressSpinnerModule,
        FormsModule,
        TableModule,
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
