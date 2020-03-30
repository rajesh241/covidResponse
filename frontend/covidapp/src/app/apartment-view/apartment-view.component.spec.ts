import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentViewComponent } from './apartment-view.component';

describe('ApartmentViewComponent', () => {
  let component: ApartmentViewComponent;
  let fixture: ComponentFixture<ApartmentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
