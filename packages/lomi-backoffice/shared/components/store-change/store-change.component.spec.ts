import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreChangeComponent } from './store-change.component';

describe('StoreChangeComponent', () => {
  let component: StoreChangeComponent;
  let fixture: ComponentFixture<StoreChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreChangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
