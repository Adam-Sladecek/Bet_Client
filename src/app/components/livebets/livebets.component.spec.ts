import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivebetsComponent } from './livebets.component';

describe('LivebetsComponent', () => {
  let component: LivebetsComponent;
  let fixture: ComponentFixture<LivebetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivebetsComponent]
    });
    fixture = TestBed.createComponent(LivebetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
