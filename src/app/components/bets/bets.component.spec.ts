import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { TaskState } from 'src/app/enums/task-state';
import { By } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';

import { WebSocketService } from 'src/app/services/web-socket.service';
import { BetsComponent } from './bets.component';
import { IOddModel } from 'src/app/interfaces/Bet/iodd-model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BetsComponent', () => {
  let component: BetsComponent;
  let fixture: ComponentFixture<BetsComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [BetsComponent],
    imports: [FormsModule,
        TableModule,
        ButtonModule,
        ToastModule,
        DialogModule],
    providers: [WebSocketService, MessageService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check app state', () => {
    var button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
    var disable = component.disable_buttons()
    expect(disable).toBeTrue();
    component['taskState'] = TaskState.RUNNING
    disable = component.disable_buttons()
    var running = component.appRunning()
    var ending = component.endingScrape()
    expect(disable).toBeFalse();
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeFalse();
    expect(running).toBeTrue();
    expect(ending).toBeFalse();
    component['taskState'] = TaskState.ENDING
    disable = component.disable_buttons()
    running = component.appRunning()
    ending = component.endingScrape()
    expect(disable).toBeTrue();
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
    expect(running).toBeFalse();
    expect(ending).toBeTrue();
    component['taskState'] = TaskState.CLOSED
    disable = component.disable_buttons()
    running = component.appRunning()
    ending = component.endingScrape()
    expect(disable).toBeFalse();
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeFalse();
    expect(running).toBeFalse();
    expect(ending).toBeFalse();
  })

  it('should get match from sb', () => { 
    const mockBets: IOddModel[] = [
      {
        id: 0,
        sportsbook_id: 1,
      } as IOddModel,
      {
        id: 1,
        sportsbook_id: 2,
      } as IOddModel,
    ]
    const match = component.getMatchFromSb(1, mockBets)
    expect(match?.id).toBe(0)
  })

  it('should start and end scrape', () => {
    spyOn<any>(component['websocketService'], 'sendMessage');

    component.startScrape();
    expect(component['websocketService'].sendMessage).toHaveBeenCalledWith({ action: 'start' });
    component.endScrape();
    expect(component.endingScrape()).toBeTrue();
    expect(component['websocketService'].sendMessage).toHaveBeenCalledWith({ action: 'end' });
  })
  
  it('should pad zero', () => {
    expect(component['padZero'](4)).toBe('04')
  })
});
