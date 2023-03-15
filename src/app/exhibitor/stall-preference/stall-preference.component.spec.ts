import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StallPreferenceComponent } from './stall-preference.component';

describe('StallPreferenceComponent', () => {
  let component: StallPreferenceComponent;
  let fixture: ComponentFixture<StallPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StallPreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StallPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
