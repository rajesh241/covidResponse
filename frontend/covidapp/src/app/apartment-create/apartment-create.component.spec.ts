import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentCreateComponent } from './apartment-create.component';

describe('ApartmentCreateComponent', () => {
  let component: ApartmentCreateComponent;
  let fixture: ComponentFixture<ApartmentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
