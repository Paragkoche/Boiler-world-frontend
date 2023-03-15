import { TestBed } from '@angular/core/testing';

import { ExhibitorGuard } from './exhibitor.guard';

describe('ExhibitorGuard', () => {
  let guard: ExhibitorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExhibitorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
