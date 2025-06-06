import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangestatusComponent } from './changestatus.component';

describe('ChangestatusComponent', () => {
  let component: ChangestatusComponent;
  let fixture: ComponentFixture<ChangestatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangestatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
