import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { EventDialogComponent } from './event-dialog.component';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { EventService } from 'src/app/services/event.service';

describe('EventDialogComponent', () => {
  let component: EventDialogComponent;
  let fixture: ComponentFixture<EventDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        FormsModule,
        TableModule,
        ProgressSpinnerModule,
        ButtonModule,
        HttpClientTestingModule
      ],
      declarations: [EventDialogComponent],
      providers: [WebSocketService, MessageService, EventService]
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
