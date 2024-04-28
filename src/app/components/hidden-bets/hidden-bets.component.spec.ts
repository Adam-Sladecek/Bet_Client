import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HiddenBetsComponent } from './hidden-bets.component';
import { WebSocketService } from 'src/app/services/web-socket.service';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

describe('HiddenBetsComponent', () => {
  let component: HiddenBetsComponent;
  let fixture: ComponentFixture<HiddenBetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        FormsModule,
        TableModule,
        ButtonModule,
      ],
      declarations: [HiddenBetsComponent],
      providers: [WebSocketService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenBetsComponent);
    component = fixture.componentInstance;
    const bets = [
      {
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
          odd: 0,
          amount: 0
        }]
      },
      {
        id: 1,
        updated: '',
        first_odd_id: 0,
        second_odd_id: 0,
        sport_id: 0,
        sport_name: '',
        profit: 0,
        details: [{
          id: 1,
          player_name: '',
          sportsbook_name: '',
          opportunity_name: '',
          odd: 0,
          amount: 0
        }]
      },
      {
        id: 2,
        updated: '',
        first_odd_id: 0,
        second_odd_id: 0,
        sport_id: 0,
        sport_name: '',
        profit: 0,
        details: [{
          id: 2,
          player_name: '',
          sportsbook_name: '',
          opportunity_name: '',
          odd: 0,
          amount: 0
        }]
      },
    ];
    component['websocketService'].hiddenBets = bets
    component.hiddenBets = component['websocketService'].hiddenBets
    fixture.detectChanges();
  });

  // function tests 
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove the specified bet from hiddenBets array', () => {
    component.renewBet(component['websocketService'].hiddenBets[0]);
    fixture.detectChanges();
    expect(component['websocketService'].hiddenBets.map(bet => bet.id)).toEqual([1,2]);
  });

  // DOM tests

  it('should call renewBet after click', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    fixture.detectChanges();
    spyOn(component, 'renewBet');
    button.click();
    expect(component.renewBet).toHaveBeenCalled();
  });
});
