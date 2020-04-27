import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityUpdateComponent } from './entity-update.component';

describe('EntityUpdateComponent', () => {
  let component: EntityUpdateComponent;
  let fixture: ComponentFixture<EntityUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
