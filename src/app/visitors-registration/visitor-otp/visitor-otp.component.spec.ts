import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorOtpComponent } from './visitor-otp.component';

describe('VisitorOtpComponent', () => {
  let component: VisitorOtpComponent;
  let fixture: ComponentFixture<VisitorOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
