import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Loading, ToastController, Alert, AlertController, Toast } from 'ionic-angular';
import { GalleryPage } from '../gallery/gallery';
import { SingleImagePage } from '../../shared/pages/single-image/single-image';
import { MapsPage } from '../maps/maps';
import { NewRatingPage } from '../new-rating/new-rating';
import { Business } from '../../shared/models/business.model';
import { BusinessProvider } from '../../providers/business.provider';
import { BusinessStatus } from '../../shared/models/business-status.enum';
import { SecurityProvider } from '../../providers/security.provider';
import { Session } from '../../shared/models/session.model';
import { Rating } from '../../shared/models/rating.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RatingStats } from '../../shared/models/rating-stats.model';
import { AllRatingsPage } from '../all-ratings/all-ratings';

@Component({
  selector: 'page-bussiness-home',
  templateUrl: 'bussiness-home.html',
})
export class BussinessHomePage {

  public Array: ArrayConstructor = Array;
  public BusinessStatus = BusinessStatus;
  public session: Session;
  public business: Business;
  public ratings: Rating[];
  public ratingStats: RatingStats;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private securityProvider: SecurityProvider,
    private businessProvider: BusinessProvider
  ) {
  }

  ionViewWillEnter() {
    const loading: Loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    loading.present().then(() => {
      this.business = this.navParams.get('business');
      this.getSession();
      this.getRatings(loading);
    });
  }

  getSession() {
    this.securityProvider.getSession().subscribe(
      (session: Session) => {
        this.session = session;
      }
    )
  }

  getRatings(loading: Loading) {
    this.businessProvider.getRatings(this.business.id).subscribe(
      (res: any) => {
        this.ratings = res.ratings;
        this.ratingStats = res.stats;
        loading.dismiss();
      },
      (error: HttpErrorResponse) => {
        loading.dismiss();
      }
    );
  }

  onViewAllPhotos() {
    this.navCtrl.push(GalleryPage, { name: this.business.name, images: this.business.images });
  }

  onViewPhoto(image: any) {
    const modal = this.modalCtrl.create(SingleImagePage, { src: image.url });

    modal.present();
  }

  onOpenMapsPage() {
    this.navCtrl.push(MapsPage, { name: this.business.name, coordinates: this.business.location.coordinates });
  }

  onOpenNewRatingPage() {
    this.navCtrl.push(NewRatingPage, { business: this.business });
  }

  onOpenAllRatingsPage() {
    this.navCtrl.push(AllRatingsPage, { name: this.business.name, ratings: this.ratings });
  }

  onShowConfirm(status: BusinessStatus) {
    let title: string;

    if (status === BusinessStatus.APPROVED) {
      title = '¿Desea aprobar el negocio?';
    }

    if (status === BusinessStatus.REJECTED) {
      title = '¿Desea rechazar el negocio?';
    }

    const confirm: Alert = this.alertCtrl.create({
      title,
      message: 'La decisión tomada no puede ser revertida!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.changeBusinessStatus(status);
          }
        }
      ]
    });

    confirm.present();
  }

  changeBusinessStatus(status: BusinessStatus) {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      this.businessProvider.changeBusinessStatus(this.business.id, status).subscribe(
        (res: any) => {
          if (status === BusinessStatus.APPROVED) {
            this.showMessage('El negocio ha sido aprobado con éxito.');
          }
          if (status === BusinessStatus.REJECTED) {
            this.showMessage('El negocio ha sido rechazado con éxito.');
          }
          loading.dismiss();
          this.navCtrl.pop();
        },
        (error: any) => {
          this.showMessage('Ha ocurrido un error. Por favor, vuelva a intentarlo.');
          loading.dismiss();
        }
      )
    })
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
