import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidCreateComponent } from './covid-create.component';

describe('CovidCreateComponent', () => {
  let component: CovidCreateComponent;
  let fixture: ComponentFixture<CovidCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
