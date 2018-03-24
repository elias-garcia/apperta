import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { BusinessType } from '../../shared/models/business-type.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {

  public BusinessType = BusinessType;
  public filtersForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm() {
    const filters = this.navParams.get('filters');

    this.filtersForm = this.fb.group({
      type: [filters.type],
      avgRating: [filters.avgRating]
    });
  }

  onResetFilters() {
    this.filtersForm.patchValue({ type: '', avgRating: '' });
  }

  onFilter() {
    const filters: any = {
      type: this.type.value,
      avgRating: this.avgRating.value
    };

    this.viewCtrl.dismiss(filters);
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  get type() {
    return this.filtersForm.get('type');
  }

  get avgRating() {
    return this.filtersForm.get('avgRating');
  }

}
