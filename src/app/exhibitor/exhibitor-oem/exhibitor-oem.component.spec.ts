import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorOemComponent } from './exhibitor-oem.component';

describe('ExhibitorOemComponent', () => {
  let component: ExhibitorOemComponent;
  let fixture: ComponentFixture<ExhibitorOemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExhibitorOemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitorOemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
