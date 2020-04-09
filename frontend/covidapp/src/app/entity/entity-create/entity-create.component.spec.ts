import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCreateComponent } from './entity-create.component';

describe('EntityCreateComponent', () => {
  let component: EntityCreateComponent;
  let fixture: ComponentFixture<EntityCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
