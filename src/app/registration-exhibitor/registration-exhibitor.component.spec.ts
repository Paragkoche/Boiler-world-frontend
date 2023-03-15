import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationExhibitorComponent } from './registration-exhibitor.component';

describe('RegistrationExhibitorComponent', () => {
  let component: RegistrationExhibitorComponent;
  let fixture: ComponentFixture<RegistrationExhibitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationExhibitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationExhibitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
