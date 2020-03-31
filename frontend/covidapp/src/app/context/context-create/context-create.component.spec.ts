import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextCreateComponent } from './context-create.component';

describe('ContextCreateComponent', () => {
  let component: ContextCreateComponent;
  let fixture: ComponentFixture<ContextCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
