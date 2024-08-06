import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class BaseURLInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Remove the 1st slash from the URL
    const url = req.url.replace(/^\//, '');

    // Append the API URL to the request
    const apiReq = req.clone({ url: `${environment.apiURL}/${url}` });
    return next.handle(apiReq);
  }
}
