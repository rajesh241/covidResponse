import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatloginComponent } from './matlogin.component';

describe('MatloginComponent', () => {
  let component: MatloginComponent;
  let fixture: ComponentFixture<MatloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
