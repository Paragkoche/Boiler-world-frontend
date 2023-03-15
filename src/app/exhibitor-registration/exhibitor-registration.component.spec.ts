import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorRegistrationComponent } from './exhibitor-registration.component';

describe('ExhibitorRegistrationComponent', () => {
  let component: ExhibitorRegistrationComponent;
  let fixture: ComponentFixture<ExhibitorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExhibitorRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
