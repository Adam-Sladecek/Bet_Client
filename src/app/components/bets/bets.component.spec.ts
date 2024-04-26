import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetsComponent } from './bets.component';

import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

describe('BetsComponent', () => {
  let component: BetsComponent;
  let fixture: ComponentFixture<BetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TableModule,
        InputNumberModule,
        ButtonModule,
        ToastModule,
        SliderModule
      ],
      declarations: [BetsComponent]
    });
    fixture = TestBed.createComponent(BetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
