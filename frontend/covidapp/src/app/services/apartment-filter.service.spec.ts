import { TestBed } from '@angular/core/testing';

import { ApartmentFilterService } from './apartment-filter.service';

describe('ApartmentFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApartmentFilterService = TestBed.get(ApartmentFilterService);
    expect(service).toBeTruthy();
  });
});
