import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private spinner: NgxSpinnerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.show();
    this.spinner.show();

    return next.handle(request).pipe(
      tap(() => {
        this.loadingService.show();
        this.spinner.show();
      }),
      finalize(() => {
        this.loadingService.hide();
        this.spinner.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        this.spinner.hide();
        throw error;
      })
    );
  }
}
