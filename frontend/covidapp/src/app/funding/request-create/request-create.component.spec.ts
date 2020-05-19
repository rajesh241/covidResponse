import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCreateComponent } from './request-create.component';

describe('RequestCreateComponent', () => {
  let component: RequestCreateComponent;
  let fixture: ComponentFixture<RequestCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
