import { TestBed } from '@angular/core/testing';

import { ApartmentService } from './apartment.service';

describe('ApartmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApartmentService = TestBed.get(ApartmentService);
    expect(service).toBeTruthy();
  });
});
