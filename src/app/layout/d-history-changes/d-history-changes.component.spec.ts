import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DHistoryChangesComponent } from './d-history-changes.component';

describe('DHistoryChangesComponent', () => {
  let component: DHistoryChangesComponent;
  let fixture: ComponentFixture<DHistoryChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DHistoryChangesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DHistoryChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
