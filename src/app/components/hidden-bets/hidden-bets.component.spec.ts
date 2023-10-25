import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenBetsComponent } from './hidden-bets.component';

describe('HiddenBetsComponent', () => {
  let component: HiddenBetsComponent;
  let fixture: ComponentFixture<HiddenBetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
