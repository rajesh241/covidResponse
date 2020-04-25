import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddeditComponent } from './user-addedit.component';

describe('UserAddeditComponent', () => {
  let component: UserAddeditComponent;
  let fixture: ComponentFixture<UserAddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
