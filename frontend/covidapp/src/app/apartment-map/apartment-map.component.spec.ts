import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentMapComponent } from './apartment-map.component';

describe('ApartmentMapComponent', () => {
  let component: ApartmentMapComponent;
  let fixture: ComponentFixture<ApartmentMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
