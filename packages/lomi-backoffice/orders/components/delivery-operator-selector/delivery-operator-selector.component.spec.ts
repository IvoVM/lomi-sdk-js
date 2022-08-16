import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOperatorSelectorComponent } from './delivery-operator-selector.component';

describe('DeliveryOperatorSelectorComponent', () => {
  let component: DeliveryOperatorSelectorComponent;
  let fixture: ComponentFixture<DeliveryOperatorSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryOperatorSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOperatorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
