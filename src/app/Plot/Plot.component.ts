/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PlotService } from './Plot.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-plot',
  templateUrl: './Plot.component.html',
  styleUrls: ['./Plot.component.css'],
  providers: [PlotService]
})
export class PlotComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  plotId = new FormControl('', Validators.required);
  cultivationStartDate = new FormControl('', Validators.required);
  extent = new FormControl('', Validators.required);
  closerplots = new FormControl('', Validators.required);
  activities = new FormControl('', Validators.required);
  phReadings = new FormControl('', Validators.required);
  certificationBodyComments = new FormControl('', Validators.required);
  farm = new FormControl('', Validators.required);

  constructor(public servicePlot: PlotService, fb: FormBuilder) {
    this.myForm = fb.group({
      plotId: this.plotId,
      cultivationStartDate: this.cultivationStartDate,
      extent: this.extent,
      closerplots: this.closerplots,
      activities: this.activities,
      phReadings: this.phReadings,
      certificationBodyComments: this.certificationBodyComments,
      farm: this.farm
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePlot.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.ucsc.agriblockchain.Plot',
      'plotId': this.plotId.value,
      'cultivationStartDate': this.cultivationStartDate.value,
      'extent': this.extent.value,
      'closerplots': this.closerplots.value,
      'activities': this.activities.value,
      'phReadings': this.phReadings.value,
      'certificationBodyComments': this.certificationBodyComments.value,
      'farm': this.farm.value
    };

    this.myForm.setValue({
      'plotId': null,
      'cultivationStartDate': null,
      'extent': null,
      'closerplots': null,
      'activities': null,
      'phReadings': null,
      'certificationBodyComments': null,
      'farm': null
    });

    return this.servicePlot.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'plotId': null,
        'cultivationStartDate': null,
        'extent': null,
        'closerplots': null,
        'activities': null,
        'phReadings': null,
        'certificationBodyComments': null,
        'farm': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.ucsc.agriblockchain.Plot',
      'cultivationStartDate': this.cultivationStartDate.value,
      'extent': this.extent.value,
      'closerplots': this.closerplots.value,
      'activities': this.activities.value,
      'phReadings': this.phReadings.value,
      'certificationBodyComments': this.certificationBodyComments.value,
      'farm': this.farm.value
    };

    return this.servicePlot.updateAsset(form.get('plotId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicePlot.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePlot.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'plotId': null,
        'cultivationStartDate': null,
        'extent': null,
        'closerplots': null,
        'activities': null,
        'phReadings': null,
        'certificationBodyComments': null,
        'farm': null
      };

      if (result.plotId) {
        formObject.plotId = result.plotId;
      } else {
        formObject.plotId = null;
      }

      if (result.cultivationStartDate) {
        formObject.cultivationStartDate = result.cultivationStartDate;
      } else {
        formObject.cultivationStartDate = null;
      }

      if (result.extent) {
        formObject.extent = result.extent;
      } else {
        formObject.extent = null;
      }

      if (result.closerplots) {
        formObject.closerplots = result.closerplots;
      } else {
        formObject.closerplots = null;
      }

      if (result.activities) {
        formObject.activities = result.activities;
      } else {
        formObject.activities = null;
      }

      if (result.phReadings) {
        formObject.phReadings = result.phReadings;
      } else {
        formObject.phReadings = null;
      }

      if (result.certificationBodyComments) {
        formObject.certificationBodyComments = result.certificationBodyComments;
      } else {
        formObject.certificationBodyComments = null;
      }

      if (result.farm) {
        formObject.farm = result.farm;
      } else {
        formObject.farm = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'plotId': null,
      'cultivationStartDate': null,
      'extent': null,
      'closerplots': null,
      'activities': null,
      'phReadings': null,
      'certificationBodyComments': null,
      'farm': null
      });
  }

}
