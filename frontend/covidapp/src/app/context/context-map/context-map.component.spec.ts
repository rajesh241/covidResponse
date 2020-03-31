import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMapComponent } from './context-map.component';

describe('ContextMapComponent', () => {
  let component: ContextMapComponent;
  let fixture: ComponentFixture<ContextMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
