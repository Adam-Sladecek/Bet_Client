import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { ConfigComponent } from './config.component';
import { ConfigService } from 'src/app/services/config.service';
import { IConfigResponse } from 'src/app/interfaces/iconfigresponse';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        FormsModule,
        ButtonModule,
        MultiSelectModule,
        ToastModule,
        HttpClientTestingModule,
        CommonModule,
      ],
      declarations: [ConfigComponent],
      providers: [ConfigComponent, ConfigService, MessageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // function tests

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setConfig', () => {
    const body = { sports: component.selectedSports, sportsBooks: component.selectedSportsBooks };
    const response = {success: true, message: 'Configuration saved.'};
    spyOn(component['configService'], 'setConfig').and.returnValue(new Observable(subscriber => {
      expect(component.gettingConfig).toBeTrue();
      subscriber.next(response);
    }));
    spyOn(component['messageService'], 'add');
  
    component.setConfig();
  
    expect(component['configService'].setConfig).toHaveBeenCalledWith(body);
    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'success', summary: 'Success', detail: response.message });
    expect(component.gettingConfig).toBeFalse();
  });

  it('should handle error in setConfig', () => {
    const body = { sports: component.selectedSports, sportsBooks: component.selectedSportsBooks };
    const err = { error: { message: 'Bad request' } };
    spyOn(component['configService'], 'setConfig').and.returnValue(new Observable(subscriber => {
      expect(component.gettingConfig).toBeTrue();
      subscriber.error(err);
    }));
    spyOn(component['messageService'], 'add');
    spyOn(console, 'error');
    component.setConfig();

    expect(component['configService'].setConfig).toHaveBeenCalledOnceWith(body);
    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'error', summary: 'Error', detail: err.error.message});
    expect(console.error).toHaveBeenCalledWith(err);
    expect(component.gettingConfig).toBeFalse();
  });

  it('should call getConfig', () => {
    const response = {
      sportsBooks: [
          {'id': 1, 'name': 'Doxxbet', 'selected': false} ,
          {'id': 6, 'name': 'Tipsport', 'selected': true}, 
        ],
      sports: [
          {'id': 1, 'name': 'Tennis', 'selected': true},
          {'id': 2, 'name': 'Darts', 'selected': false},
      ]
    } as IConfigResponse

    const filteredResponse = {
      sportsBooks: [
          {'id': 6, 'name': 'Tipsport', 'selected': true}, 
        ],
      sports: [
          {'id': 1, 'name': 'Tennis', 'selected': true},
    ]
    } as IConfigResponse

    spyOn(component['configService'], 'getConfig').and.returnValue(new Observable(subscriber => {
      expect(component.gettingConfig).toBeTrue();
      subscriber.next(response);
    }));
  
    component['getConfig']();
  
    expect(component['configService'].getConfig).toHaveBeenCalled();
    expect(component.sports).toEqual(response.sports);
    expect(component.sportsBooks).toEqual(response.sportsBooks);
    expect(component.selectedSports).toEqual(filteredResponse.sports);
    expect(component.selectedSportsBooks).toEqual(filteredResponse.sportsBooks);
    expect(component.gettingConfig).toBeFalse();
  });

  it('should handle error in getConfig', () => {
    const err = { error: { message: 'Bad request' } };
    spyOn(component['configService'], 'getConfig').and.returnValue(new Observable(subscriber => {
      expect(component.gettingConfig).toBeTrue();
      subscriber.error(err);
    }));

    spyOn(component['messageService'], 'add');
    spyOn(console, 'error');

    component['getConfig']();

    expect(component['configService'].getConfig).toHaveBeenCalled();
    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'error', summary: 'Error', detail: err.error.message});
    expect(console.error).toHaveBeenCalledOnceWith(err);
    expect(component.gettingConfig).toBeFalse();
  });

  it('should call ngOnInit ', () => {
    spyOn<any>(component, 'getConfig');

    expect(component.gettingConfig).toBeTrue();
    expect(component.sports).toEqual([]);
    expect(component.sportsBooks).toEqual([]);
    expect(component.selectedSports).toEqual([]);
    expect(component.selectedSportsBooks).toEqual([]);
    expect(component.inputUrlSegment).toEqual('');

    component.ngOnInit();
    expect(component['getConfig']).toHaveBeenCalled();
  })

  it('should call setUrl ', () => {
    spyOn<any>(component, 'getConfig');
    spyOn(localStorage, 'setItem');
    spyOn(component['messageService'], 'add');

    const mockSegment = '1234'
    component.inputUrlSegment = mockSegment
    component.setUrl();
    expect(component['getConfig']).toHaveBeenCalled();
    expect(component['messageService'].add).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledOnceWith('urlSegment', component.inputUrlSegment);
  })

  // DOM tests

  it('should disable button and call functions', () => {
    component.sports = [
      {'id': 1, 'name': 'Tennis', 'selected': true},
    ] 
    component.sportsBooks = [
      {'id': 1, 'name': 'Doxxbet', 'selected': false} ,
    ]
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
    component.gettingConfig = false
    fixture.detectChanges();
    spyOn(component, 'setConfig');
    expect(button.disabled).toBeFalse();
    button.click();
    expect(component.setConfig).toHaveBeenCalled();
    spyOn(component, 'setUrl');
    const button2 = fixture.debugElement.queryAll(By.css('button'))[1].nativeElement;
    button2.click();
    expect(component.setUrl).toHaveBeenCalled();
  });
});
