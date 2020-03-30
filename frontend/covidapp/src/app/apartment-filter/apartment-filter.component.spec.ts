import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentFilterComponent } from './apartment-filter.component';

describe('ApartmentFilterComponent', () => {
  let component: ApartmentFilterComponent;
  let fixture: ComponentFixture<ApartmentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
