import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReintegrateOrderComponent } from './reintegrate-order.component';

describe('ReintegrateOrderComponent', () => {
  let component: ReintegrateOrderComponent;
  let fixture: ComponentFixture<ReintegrateOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReintegrateOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReintegrateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
