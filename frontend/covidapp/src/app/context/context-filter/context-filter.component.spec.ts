import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextFilterComponent } from './context-filter.component';

describe('ContextFilterComponent', () => {
  let component: ContextFilterComponent;
  let fixture: ComponentFixture<ContextFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
