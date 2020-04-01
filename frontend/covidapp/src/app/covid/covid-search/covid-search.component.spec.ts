import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidSearchComponent } from './covid-search.component';

describe('CovidSearchComponent', () => {
  let component: CovidSearchComponent;
  let fixture: ComponentFixture<CovidSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
