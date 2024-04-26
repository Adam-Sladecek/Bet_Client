import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenBetsComponent } from './hidden-bets.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

describe('HiddenBetsComponent', () => {
  let component: HiddenBetsComponent;
  let fixture: ComponentFixture<HiddenBetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TableModule,
        ButtonModule,
      ],
      declarations: [HiddenBetsComponent]
    });
    fixture = TestBed.createComponent(HiddenBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
