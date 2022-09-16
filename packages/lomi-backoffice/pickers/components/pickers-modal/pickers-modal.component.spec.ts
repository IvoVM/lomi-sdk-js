import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickersModalComponent } from './pickers-modal.component';

describe('PickersModalComponent', () => {
  let component: PickersModalComponent;
  let fixture: ComponentFixture<PickersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickersModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PickersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
