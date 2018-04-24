import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityProvider } from '../providers/security.provider';
import { tap } from 'rxjs/operators';
import { Toast, ToastController, NavController, App } from 'ionic-angular';
import { HomePage } from '../pages/home/home';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private navCtrl: NavController;

  constructor(
    private securityProvider: SecurityProvider,
    private toastCtrl: ToastController,
    private app: App
  ) {
    this.navCtrl = this.app.getActiveNav();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        () => { },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 401:
                this.handleUnauthorizedError();
                break;
            }
          }
        }
      )
    );
  }

  handleUnauthorizedError() {
    this.showMessage('La sesión ha expirado. Por favor, vuelva a iniciar sesión.');
    this.securityProvider.removeSession();
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot;
  }

  showMessage(message: string) {
    const toast: Toast = this.toastCtrl.create({
      message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 3000
    });

    toast.present();
  }

}
