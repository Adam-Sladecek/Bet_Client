import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ConfigComponent } from './config.component';
import { ConfigService } from 'src/app/services/config.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ConfigComponent],
    imports: [FormsModule,
        ButtonModule,
        MultiSelectModule,
        ToastModule,
        CommonModule,
        ProgressSpinnerModule],
    providers: [ConfigComponent, ConfigService, MessageService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit ', () => {
    spyOn<any>(component, 'getConfig');

    expect(component.gettingConfig).toBeTrue();
    expect(component.sports).toEqual([]);
    expect(component.sportsbooks).toEqual([]);
    expect(component.selectedSports).toEqual([]);
    expect(component.selectedSportsbooks).toEqual([]);

    component.ngOnInit();
    expect(component['getConfig']).toHaveBeenCalled();
  })
});
