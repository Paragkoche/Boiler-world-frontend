import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorRegisterationConfirmationComponent } from './exhibitor-registeration-confirmation.component';

describe('ExhibitorRegisterationConfirmationComponent', () => {
  let component: ExhibitorRegisterationConfirmationComponent;
  let fixture: ComponentFixture<ExhibitorRegisterationConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExhibitorRegisterationConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitorRegisterationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
