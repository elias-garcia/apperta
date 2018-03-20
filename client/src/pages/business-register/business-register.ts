import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { NavController, NavParams, Content, AlertController, ActionSheetController, LoadingController, Loading, ToastController } from 'ionic-angular';
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
import 'rxjs/add/operator/map'
import { GeolocationProvider } from '../../providers/geolocation.provider';

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
  public tempGalleryImages: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private fb: FormBuilder,
    private geolocation: Geolocation,
    private renderer: Renderer2,
    private businessProvider: BusinessProvider,
    private loadingCtrl: LoadingController,
    private securityProvider: SecurityProvider,
    private geolocationProvider: GeolocationProvider,
    private toastCtrl: ToastController
  ) {
    this.createForm();
  }

  ionViewDidLoad() {
    this.initAutocomplete();

    this.session = this.navParams.get('session');

    if (this.navParams.get('mode') === 'edit') {
      const loading = this.loadingCtrl.create({
        content: 'Cargando...'
      });

      loading.present().then(() => {
        this.patchFormValues(loading);
      });
    }
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      type: [null, Validators.required],
      location: ['', Validators.required],
      cover: ['', Validators.required],
      galleryImages: [[]]
    });
  }

  patchFormValues(loading: Loading) {
    this.geolocationProvider.reverseGeocode(
      this.session.business.location.coordinates[0],
      this.session.business.location.coordinates[1]
    ).subscribe(
      (results: google.maps.GeocoderResult[]) => {
        this.registerForm.patchValue({
          name: this.session.business.name,
          phone: this.session.business.phone,
          type: this.session.business.type,
          location: results[0].formatted_address,
          cover: this.session.business.cover.url,
          galleryImages: this.session.business.images
        });
        loading.dismiss();
      },
      (error: any) => {
        loading.dismiss();
      }
    );
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
    const files: FileList = this.coverImageInput.nativeElement.files;

    if (files[0]) {
      const file: File = this.coverImageInput.nativeElement.files[0];

      if (this.filesExceedsMaxSizes([file])) {
        const alert = this.alertCtrl.create({
          title: 'La foto es demasiado grande',
          subTitle: 'Por favor, selecciona una foto que ocupe 4mb o menos',
          buttons: ['Entendido']
        });

        alert.present();
        this.coverImageInput.nativeElement.value = '';
      } else {
        this.readCoverImage(file);
      }
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
      } else {
        Array.from(files).forEach((file: File) => {
          const fileReader = new FileReader();

          fileReader.onloadend = (event: any) => {
            if (this.navParams.get('mode') === 'edit') {
              this.tempGalleryImages.push(event.target.result);
            } else {
              this.galleryImages.patchValue([...this.galleryImages.value, event.target.result]);
            }
          };

          fileReader.readAsDataURL(file);
        });
      }
    }
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

                this.businessProvider.removeImageFromBusiness(this.session.business.id, image.id)
                  .subscribe(
                    (res: any) => {
                      this.galleryImages.patchValue(this.removeFromArrayByIndex(index, this.galleryImages.value));
                      this.session.business.images = this.removeFromArrayByIndex(index, this.session.business.images);
                      this.securityProvider.storeSession(this.session);
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
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });

    actionSheet.present();
  }

  filesExceedsMaxSizes(arr: File[]) {
    const bigFiles = arr.filter((file: File) => {
      return file.size > MAX_FILE_SIZE;
    });

    return bigFiles.length;
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
              phone: this.phone.value,
              type: this.type.value,
              location: [results[0].geometry.location.lat(), results[0].geometry.location.lng()],
              cover: this.cover.value
            };

            let httpCall$: Observable<Object>;

            if (this.navParams.get('mode') === 'edit') {
              httpCall$ = this.businessProvider.editBusiness(this.session.business.id, registerData);
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
                        this.session.business = tempBusiness;
                        this.securityProvider.storeSession(this.session);
                        loading.dismiss();
                        this.navCtrl.pop();
                        this.showMessage('Los datos del negocio han sido guardados con éxito.');
                      }
                    );
                } else {
                  this.session.business = tempBusiness;
                  this.securityProvider.storeSession(this.session);
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

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  get name(): AbstractControl {
    return this.registerForm.get('name');
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

  get cover(): AbstractControl {
    return this.registerForm.get('cover');
  }

  get galleryImages(): AbstractControl {
    return this.registerForm.get('galleryImages');
  }

}
