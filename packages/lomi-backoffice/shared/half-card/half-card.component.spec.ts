import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfCardComponent } from './half-card.component';

describe('HalfCardComponent', () => {
  let component: HalfCardComponent;
  let fixture: ComponentFixture<HalfCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HalfCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HalfCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
