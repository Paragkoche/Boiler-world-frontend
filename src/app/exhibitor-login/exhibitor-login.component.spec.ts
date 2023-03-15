import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorLoginComponent } from './exhibitor-login.component';

describe('ExhibitorLoginComponent', () => {
  let component: ExhibitorLoginComponent;
  let fixture: ComponentFixture<ExhibitorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExhibitorLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
