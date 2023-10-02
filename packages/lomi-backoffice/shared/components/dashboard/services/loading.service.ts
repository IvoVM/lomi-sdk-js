import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loadingSubject = new Subject<boolean>();

  /**
   * Shows the loading indicator.
   * If an error occurs while emitting the value, it will be caught and logged.
   */
  show() {
    try {
      this.loadingSubject.next(true);
    } catch (error) {
      console.error(error);
    }
  }

  hide() {
    try {
      this.loadingSubject.next(false);
    } catch (error) {
      console.error(error);
    }
  }
}
