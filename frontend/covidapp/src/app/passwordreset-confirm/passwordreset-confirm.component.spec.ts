import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordresetConfirmComponent } from './passwordreset-confirm.component';

describe('PasswordresetConfirmComponent', () => {
  let component: PasswordresetConfirmComponent;
  let fixture: ComponentFixture<PasswordresetConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordresetConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordresetConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
