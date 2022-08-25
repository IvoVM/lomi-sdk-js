import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerSelectComponent } from './picker-select.component';

describe('PickerSelectComponent', () => {
  let component: PickerSelectComponent;
  let fixture: ComponentFixture<PickerSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickerSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
