import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';

import { OpportunityDialogComponent } from './opportunity-dialog.component';
import { EventService } from 'src/app/services/event.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpportunityDialogComponent', () => {
  let component: OpportunityDialogComponent;
  let fixture: ComponentFixture<OpportunityDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [OpportunityDialogComponent],
    imports: [FormsModule,
        TableModule,
        ProgressSpinnerModule,
        ButtonModule],
    providers: [MessageService, EventService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
