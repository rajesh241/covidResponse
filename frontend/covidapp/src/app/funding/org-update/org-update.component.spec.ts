import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUpdateComponent } from './org-update.component';

describe('OrgUpdateComponent', () => {
  let component: OrgUpdateComponent;
  let fixture: ComponentFixture<OrgUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
