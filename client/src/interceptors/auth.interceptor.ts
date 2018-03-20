import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityProvider } from '../providers/security.provider';
import { Session } from '../shared/models/session.model';
import { mergeMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private securityProvider: SecurityProvider
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.securityProvider.getSession()
      .pipe(
        take(1),
        mergeMap(
          (session: Session) => {
            if (session) {
              const dupReq =
                req.clone({ setHeaders: { Authorization: `Bearer ${session.token}` } });

              return next.handle(dupReq);
            }

            return next.handle(req);
          }
        )
      )
  }

}
