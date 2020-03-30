import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentEditComponent } from './apartment-edit.component';

describe('ApartmentEditComponent', () => {
  let component: ApartmentEditComponent;
  let fixture: ComponentFixture<ApartmentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
