import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { EventDialogComponent } from './event-dialog.component';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { EventService } from 'src/app/services/event.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EventDialogComponent', () => {
  let component: EventDialogComponent;
  let fixture: ComponentFixture<EventDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [EventDialogComponent],
    imports: [FormsModule,
        TableModule,
        ProgressSpinnerModule,
        ButtonModule],
    providers: [WebSocketService, MessageService, EventService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
