import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { WebSocketService } from 'src/app/services/web-socket.service';
import { BetsComponent } from './bets.component';

import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { IBet } from 'src/app/interfaces/ibet';
import { TaskState } from 'src/app/enums/task-state';
import { IError } from 'src/app/interfaces/ierror';
import { By } from '@angular/platform-browser';

describe('BetsComponent', () => {
  let component: BetsComponent;
  let fixture: ComponentFixture<BetsComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        FormsModule,
        TableModule,
        InputNumberModule,
        ButtonModule,
        ToastModule,
        SliderModule
      ],
      declarations: [BetsComponent],
      providers: [WebSocketService, MessageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // function tests
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component['websocketService'], 'connect');

    expect(component.bets).toEqual([]);
    expect(component.budget).toBeInstanceOf(Number);
    expect(component['oldLength']).toBe(0);
    expect(component.lowerBound).toBeInstanceOf(Number);
    expect(component['defaultBet']).toEqual({id: -1} as IBet);

    component.ngOnInit();
    expect(component['websocketService'].connect).toHaveBeenCalled();
  })

  it('should call ngOnDestroy', () => {
    spyOn<any>(component['triggerEventSubscription'], 'unsubscribe');

    component.ngOnDestroy();
    expect(component['triggerEventSubscription'].unsubscribe).toHaveBeenCalled();
  })

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

  it('should set bet detail', () => {
    const bet: IBet = {
      id: 0,
      updated: '',
      first_odd_id: 0,
      second_odd_id: 0,
      sport_id: 0,
      sport_name: '',
      profit: 0,
      details: [{
        id: 0,
        player_name: '',
        sportsbook_name: '',
        opportunity_name: '',
        odd: 3,
        amount: 0
      },
      {
        id: 1,
        player_name: '',
        sportsbook_name: '',
        opportunity_name: '',
        odd: 2,
        amount: 0
      }]
    }
    var edit = component.editBet(bet)
    expect(edit).toBeFalsy()
    expect(component.betInDetail).toBeFalsy()

    component.betDetail(bet)
    expect(component.betInDetail).toEqual(bet)
    edit = component.editBet(bet)
    expect(edit).toBeTrue
    var profit = component.getEditedBetProfit()
    var amount = component.getEditedBetAmount(0)
    expect(Math.round(profit * 100) / 100).toBe(0.20)
    expect(Math.round(amount * 100) / 100).toBe(0.4)

    component.betDetail(bet)
    expect(component.betInDetail).toEqual(component['defaultBet'])
    edit = component.editBet(bet)
    expect(edit).toBeFalse
  })

  it('should hide bet', () => { 
    const mockBets: IBet[] = [
      {
        id: 0,
        updated: '',
        first_odd_id: 0,
        second_odd_id: 0,
        sport_id: 0,
        sport_name: '',
        profit: 0,
        details: []
      },
      {
        id: 1,
        updated: '',
        first_odd_id: 0,
        second_odd_id: 0,
        sport_id: 0,
        sport_name: '',
        profit: 0,
        details: []
      }
    ]
    component.bets = mockBets
    component.hideBet(mockBets[0])
    expect(component.bets[0].id).toBe(1)
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

  it('should update', () => {
    component['websocketService'].state = TaskState.RUNNING
    component['websocketService'].error = {active: true, message: 'Internal server error.'} as IError
    const bets = [ {
      id: 0,
      updated: '',
      first_odd_id: 0,
      second_odd_id: 0,
      sport_id: 0,
      sport_name: '',
      profit: 0.04,
      details: []
    }, {
      id: 1,
      updated: '',
      first_odd_id: 0,
      second_odd_id: 0,
      sport_id: 0,
      sport_name: '',
      profit: 0.02,
      details: []
    }]
    component['websocketService'].bets = bets
    spyOn<any>(component, 'playAudio');
    spyOn(component['messageService'], 'add');
    component['update']()
    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'error', summary: 'Error', detail: component.error.message});
    expect(component['playAudio']).toHaveBeenCalled();
    expect(component.lastSignal).toBeInstanceOf(String);

    component.budget = 100
    component.lowerBound = 3
    var filteredBets = component['filterBets'](bets)

    expect(filteredBets).toEqual([bets[0]])

    component['websocketService'].hiddenBets = [bets[0]]
    component.lowerBound = 1
    var filteredBets = component['filterBets'](bets)
    expect(filteredBets).toEqual([bets[1]])
  })
});
