import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';

import { OpportunityDialogComponent } from './opportunity-dialog.component';
import { EventService } from 'src/app/services/event.service';

describe('OpportunityDialogComponent', () => {
  let component: OpportunityDialogComponent;
  let fixture: ComponentFixture<OpportunityDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        FormsModule,
        TableModule,
        ProgressSpinnerModule,
        ButtonModule,
        HttpClientTestingModule
      ],
      declarations: [OpportunityDialogComponent],
      providers: [MessageService, EventService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
