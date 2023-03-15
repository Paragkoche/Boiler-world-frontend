import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeASponserComponent } from './become-a-sponser.component';

describe('BecomeASponserComponent', () => {
  let component: BecomeASponserComponent;
  let fixture: ComponentFixture<BecomeASponserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeASponserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeASponserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
