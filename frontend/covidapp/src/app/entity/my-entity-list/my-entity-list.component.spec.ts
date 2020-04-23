import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEntityListComponent } from './my-entity-list.component';

describe('MyEntityListComponent', () => {
  let component: MyEntityListComponent;
  let fixture: ComponentFixture<MyEntityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEntityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
