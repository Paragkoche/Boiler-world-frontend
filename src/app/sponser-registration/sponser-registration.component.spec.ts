import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponserRegistrationComponent } from './sponser-registration.component';

describe('SponserRegistrationComponent', () => {
  let component: SponserRegistrationComponent;
  let fixture: ComponentFixture<SponserRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponserRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
