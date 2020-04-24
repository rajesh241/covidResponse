import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCellRendererComponent } from './detail-cell-renderer.component';

describe('DetailCellRendererComponent', () => {
  let component: DetailCellRendererComponent;
  let fixture: ComponentFixture<DetailCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
