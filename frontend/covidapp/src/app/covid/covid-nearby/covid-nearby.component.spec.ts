import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidNearbyComponent } from './covid-nearby.component';

describe('CovidNearbyComponent', () => {
  let component: CovidNearbyComponent;
  let fixture: ComponentFixture<CovidNearbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidNearbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidNearbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
