import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDialogComponent } from './bulk-dialog.component';

describe('BulkDialogComponent', () => {
  let component: BulkDialogComponent;
  let fixture: ComponentFixture<BulkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
