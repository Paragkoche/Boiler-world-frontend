import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatePreviewComponent } from './delegate-preview.component';

describe('DelegatePreviewComponent', () => {
  let component: DelegatePreviewComponent;
  let fixture: ComponentFixture<DelegatePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
