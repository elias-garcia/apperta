import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { NavController, NavParams, Content, AlertController, ActionSheetController, LoadingController, Loading, ToastController, ModalController, Alert, Toast } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BusinessType } from '../../shared/models/business-type.enum';
import { BusinessRegisterData } from './business-register-data';
import { BusinessProvider } from '../../providers/business.provider';
import { HttpErrorResponse } from '@angular/common/http';
import { Session } from '../../shared/models/session.model';
import { SecurityProvider } from '../../providers/security.provider';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { GeolocationProvider } from '../../providers/geolocation.provider';
import { SingleImagePage } from '../../shared/pages/single-image/single-image';
import { Business } from '../../shared/models/business.model';
import 'rxjs/add/operator/map'

const MAX_FILE_SIZE = 4194304;

@Component({
  selector: 'page-business-register',
  templateUrl: 'business-register.html',
})
export class BusinessRegisterPage {

  @ViewChild(Content) content: Content;
  @ViewChild('locationInput') locationInput: any;
  @ViewChild('coverImageInput') coverImageInput: ElementRef;
  @ViewChild('galleryImageInput') galleryImageInput: ElementRef;

  public BusinessType = BusinessType;
  public registerForm: FormGroup;
  public session: Session;
  public business: Business;
  public tempGalleryImages: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private geolocation: Geolocation,
    private renderer: Renderer2,
    private businessProvider: BusinessProvider,
    private loadingCtrl: LoadingController,
    private securityProvider: SecurityProvider,
    private geolocationProvider: GeolocationProvider,
    private toastCtrl: ToastController,
  ) {
    this.createForm();
  }

  ionViewDidLoad() {
    this.initAutocomplete();

    const loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    loading.present().then(() => {
      this.securityProvider.getSession().subscribe(
        (session: Session) => {
          this.session = session;
          if (this.navParams.get('mode') === 'edit' && session && session.business) {
            this.getBusiness(session.business, loading);
          } else {
            loading.dismiss();
          }
        }
      );
    });
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      type: [null, Validators.required],
      location: ['', Validators.required],
      homeDeliveries: [false, Validators.required],
      cover: ['', Validators.required],
      galleryImages: [[]]
    });
  }

  getBusiness(businessId: string, loading: Loading) {
    this.businessProvider.getBusiness(businessId).subscribe(
      (res: any) => {
        this.business = res.business;
        this.patchFormValues(loading);
      }
    );
  }

  patchFormValues(loading: Loading) {
    this.registerForm.patchValue({
      name: this.business.name,
      description: this.business.description,
      phone: this.business.phone,
      type: this.business.type,
      location: this.business.location.address,
      homeDeliveries: this.business.homeDeliveries,
      cover: this.business.cover.url,
      galleryImages: this.business.images
    });

    loading.dismiss();
  }

  initAutocomplete() {
    const autocomplete =
      new google.maps.places.Autocomplete(this.locationInput._elementRef.nativeElement.children[0]);

    this.addListenerToAutocomplete(autocomplete);

    this.hideAutocompleteOnScroll();

    this.geolocation.getCurrentPosition().then((position: Geoposition) => {
      const bounds =
        new google.maps.LatLngBounds(
          new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

      autocomplete.setBounds(bounds);
    });
  }

  addListenerToAutocomplete(autocomplete: google.maps.places.Autocomplete) {
    autocomplete.addListener('place_changed', () => {
      this.location.patchValue(autocomplete.getPlace().formatted_address);
    });
  }

  hideAutocompleteOnScroll() {
    this.content.ionScroll.subscribe((event) => {
      const element = this.renderer.selectRootElement('.pac-container');

      if (element) {
        this.renderer.setStyle(element, 'display', 'none');
      }
    });
  }

  onOpenFilePicker() {
    this.coverImageInput.nativeElement.click();
  }

  onCoverImageInputChange() {
    const file: File = this.coverImageInput.nativeElement.files[0];

    this.coverImageInput.nativeElement.value = '';

    if (file) {
      if (this.filesExceedsMaxSizes([file])) {
        const alert = this.alertCtrl.create({
          title: 'La foto es demasiado grande',
          subTitle: 'Por favor, selecciona una foto que ocupe 4mb o menos',
          buttons: ['Entendido']
        });

        alert.present();

        return;
      }

      if (this.filesTypeNotValid([file])) {
        const alert = this.alertCtrl.create({
          title: 'El formato de la foto no es válido',
          subTitle: 'Por favor, selecciona una foto con formato .jpg o .png',
          buttons: ['Entendido']
        });

        alert.present();

        return;
      }

      this.readCoverImage(file);
    }
  }

  readCoverImage(file: File) {
    const fileReader = new FileReader();

    fileReader.onloadend = (event: any) => {
      this.cover.patchValue(event.target.result);
    };

    fileReader.readAsDataURL(file);
  }

  onOpenGalleryPicker() {
    this.galleryImageInput.nativeElement.click();
  }

  onGalleryImageInputChange() {
    const files: FileList = Object.assign([], this.galleryImageInput.nativeElement.files);

    this.galleryImageInput.nativeElement.value = '';

    if (files.length) {
      if (this.filesExceedsMaxSizes(Array.from(files))) {
        const alert = this.alertCtrl.create({
          title: 'Alguna foto es demasiado grande',
          subTitle: 'Por favor, selecciona fotos que ocupen 4mb o menos',
          buttons: ['Entendido']
        });

        alert.present();

        return;
      }

      if (this.filesTypeNotValid(Array.from(files))) {
        const alert = this.alertCtrl.create({
          title: 'El formato de alguna foto no es válido',
          subTitle: 'Por favor, selecciona fotos con formato .jpg o .png',
          buttons: ['Entendido']
        });

        alert.present();

        return;
      }

      Array.from(files).forEach((file: File) => {
        this.readGalleryImage(file);
      });
    }
  }

  readGalleryImage(file: File) {
    const fileReader = new FileReader();

    fileReader.onloadend = (event: any) => {
      if (this.navParams.get('mode') === 'edit') {
        this.tempGalleryImages.push(event.target.result);
      } else {
        this.galleryImages.patchValue([...this.galleryImages.value, event.target.result]);
      }
    };

    fileReader.readAsDataURL(file);
  }

  onGalleryImageClick(index: number) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (this.navParams.get('mode') === 'edit') {
              const loading = this.loadingCtrl.create({
                content: 'Eliminando...'
              });

              loading.present().then(() => {
                const image = this.galleryImages.value.filter((image, i) => i === index)[0];

                this.businessProvider.removeImageFromBusiness(this.business.id, image.id)
                  .subscribe(
                    (res: any) => {
                      this.galleryImages.patchValue(this.removeFromArrayByIndex(index, this.galleryImages.value));
                      this.business.images = this.removeFromArrayByIndex(index, this.business.images);
                      loading.dismiss();
                      this.showMessage('La imagen ha sido eliminada con éxito.');
                    }
                  );
              });
            } else {
              this.galleryImages.patchValue(this.removeFromArrayByIndex(index, this.galleryImages.value));
            }
          }
        },
        {
          text: 'Ver',
          handler: () => {
            const image = this.galleryImages.value.filter((elem, i) => i === index)[0];

            if (this.navParams.get('mode') === 'edit') {
              this.viewImage(image.url);
            } else {
              this.viewImage(image);
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });

    actionSheet.present();
  }

  onTempGalleryImageClick(index: number) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.tempGalleryImages = this.removeFromArrayByIndex(index, this.tempGalleryImages);
          }
        },
        {
          text: 'Ver',
          handler: () => {
            const image = this.tempGalleryImages.filter((elem, i) => i === index)[0];

            this.viewImage(image);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });

    actionSheet.present();
  }

  viewImage(src: string) {
    const imageModal = this.modalCtrl.create(SingleImagePage, { src });

    imageModal.present();
  }

  filesExceedsMaxSizes(arr: File[]) {
    const bigFiles = arr.filter((file: File) => {
      return file.size > MAX_FILE_SIZE;
    });

    return bigFiles.length;
  }

  filesTypeNotValid(arr: File[]) {
    const notValidFiles = arr.filter((file: File) => {
      return file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png';
    });

    return notValidFiles.length;
  }

  removeFromArrayByIndex(index: number, arr: any[]) {
    return arr.filter((elem: any, i: number) => {
      return i !== index;
    });
  }

  onRegister() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      this.geolocationProvider.geocodeAddress(this.location.value).subscribe(
        (results: google.maps.GeocoderResult[]) => {
          if (results && results[0]) {
            const registerData: BusinessRegisterData = {
              name: this.name.value,
              description: this.description.value,
              phone: this.phone.value,
              type: this.type.value,
              location: {
                address: this.location.value,
                coordinates: [results[0].geometry.location.lat(), results[0].geometry.location.lng()]
              },
              homeDeliveries: this.homeDeliveries.value,
              cover: this.cover.value
            };

            let httpCall$: Observable<Object>;

            if (this.navParams.get('mode') === 'edit') {
              httpCall$ = this.businessProvider.editBusiness(this.business.id, registerData);
            } else {
              httpCall$ = this.businessProvider.registerBusiness(registerData);
            }

            httpCall$.subscribe(
              (res: any) => {
                const tempBusiness = res.business;
                let imageCalls$: Observable<Object>[];

                if (this.navParams.get('mode') === 'edit') {
                  imageCalls$ = this.tempGalleryImages.map((image: string) => {
                    return this.businessProvider.addImageToBusiness(tempBusiness.id, image);
                  });
                } else {
                  imageCalls$ = this.galleryImages.value.map((image: string) => {
                    return this.businessProvider.addImageToBusiness(tempBusiness.id, image);
                  });
                }

                if (imageCalls$.length) {
                  forkJoin(...imageCalls$)
                    .map((resps: any[]) => {
                      return resps.map((res: any) => res.image);
                    })
                    .subscribe(
                      (images: any[]) => {
                        tempBusiness.images.push(...images);
                        this.business = tempBusiness;
                        this.session.business = this.business.id;
                        loading.dismiss();
                        this.navCtrl.pop();
                        this.showMessage('Los datos del negocio han sido guardados con éxito.');
                      }
                    );
                } else {
                  this.business = tempBusiness;
                  this.session.business = this.business.id;
                  loading.dismiss();
                  this.navCtrl.pop();
                  this.showMessage('Los datos del negocio han sido guardados con éxito.');
                }
              },
              (error: HttpErrorResponse) => {
                loading.dismiss();
              }
            );
          } else {
            this.location.setErrors({ notValidLocation: true });
            loading.dismiss();
          }
        },
        (error: PositionError) => {
          this.location.setErrors({ notValidLocation: true });
          loading.dismiss();
        }
      );
    });
  }

  onDeleteBusiness() {
    const confirm: Alert = this.alertCtrl.create({
      title: '¿Desea eliminar el negocio?',
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
            const loading = this.loadingCtrl.create({
              content: 'Por favor, espere...'
            });

            loading.present().then(() => {
              this.businessProvider.deleteBusiness(this.business.id).subscribe(
                (res: any) => {
                  this.session.business = undefined;
                  this.securityProvider.storeSession(this.session);
                  loading.dismiss();
                  this.navCtrl.pop();
                  this.showMessage('El negocio ha sido eliminado con éxito');
                },
                (err: HttpErrorResponse) => {
                  loading.dismiss();
                }
              );
            });
          }
        }
      ]
    });

    confirm.present();
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

  get name(): AbstractControl {
    return this.registerForm.get('name');
  }

  get description(): AbstractControl {
    return this.registerForm.get('description');
  }

  get phone(): AbstractControl {
    return this.registerForm.get('phone');
  }

  get type(): AbstractControl {
    return this.registerForm.get('type');
  }

  get location(): AbstractControl {
    return this.registerForm.get('location');
  }

  get homeDeliveries(): AbstractControl {
    return this.registerForm.get('homeDeliveries');
  }

  get cover(): AbstractControl {
    return this.registerForm.get('cover');
  }

  get galleryImages(): AbstractControl {
    return this.registerForm.get('galleryImages');
  }

}
