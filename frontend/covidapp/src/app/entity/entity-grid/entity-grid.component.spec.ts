import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityGridComponent } from './entity-grid.component';

describe('EntityGridComponent', () => {
  let component: EntityGridComponent;
  let fixture: ComponentFixture<EntityGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
