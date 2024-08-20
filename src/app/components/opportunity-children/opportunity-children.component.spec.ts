import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

import { OpportunityChildrenComponent } from './opportunity-children.component';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpportunityChildrenComponent', () => {
  let component: OpportunityChildrenComponent;
  let fixture: ComponentFixture<OpportunityChildrenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [OpportunityChildrenComponent],
    imports: [ProgressSpinnerModule,
        FormsModule,
        TableModule,
        ToastModule],
    providers: [OpportunityService, MessageService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
