import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDisplayComponent } from './form-display.component';

describe('FormDisplayComponent', () => {
  let component: FormDisplayComponent;
  let fixture: ComponentFixture<FormDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
