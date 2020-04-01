import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidLocateComponent } from './covid-locate.component';

describe('CovidLocateComponent', () => {
  let component: CovidLocateComponent;
  let fixture: ComponentFixture<CovidLocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidLocateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidLocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
