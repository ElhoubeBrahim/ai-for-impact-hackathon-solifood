import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { from, lastValueFrom, Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  private authentication = inject(AuthenticationService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Promise<HttpEvent<any>> {
    // Get the user token
    const token = await this.authentication.getAccessToken();

    // Clone the request and add the authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Pass the cloned request instead of the original request to the next handle
    return lastValueFrom(next.handle(authReq));
  }
}
