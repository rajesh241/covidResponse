import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmapSearchComponent } from './gmap-search.component';

describe('GmapSearchComponent', () => {
  let component: GmapSearchComponent;
  let fixture: ComponentFixture<GmapSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmapSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmapSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
