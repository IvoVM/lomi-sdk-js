import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersistentNotificationComponent } from './persistent-notification.component';

describe('PersistentNotificationComponent', () => {
  let component: PersistentNotificationComponent;
  let fixture: ComponentFixture<PersistentNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersistentNotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersistentNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
