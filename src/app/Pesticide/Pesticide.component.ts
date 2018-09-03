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
import { PesticideService } from './Pesticide.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-pesticide',
  templateUrl: './Pesticide.component.html',
  styleUrls: ['./Pesticide.component.css'],
  providers: [PesticideService]
})
export class PesticideComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  pesticideId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  manufactureDate = new FormControl('', Validators.required);
  expiryDate = new FormControl('', Validators.required);
  dateOfSale = new FormControl('', Validators.required);
  amount = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  activeChemicals = new FormControl('', Validators.required);
  certification = new FormControl('', Validators.required);
  currentOwner = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);

  constructor(public servicePesticide: PesticideService, fb: FormBuilder) {
    this.myForm = fb.group({
      pesticideId: this.pesticideId,
      name: this.name,
      manufactureDate: this.manufactureDate,
      expiryDate: this.expiryDate,
      dateOfSale: this.dateOfSale,
      amount: this.amount,
      price: this.price,
      activeChemicals: this.activeChemicals,
      certification: this.certification,
      currentOwner: this.currentOwner,
      issuer: this.issuer
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePesticide.getAll()
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
      $class: 'org.ucsc.agriblockchain.Pesticide',
      'pesticideId': this.pesticideId.value,
      'name': this.name.value,
      'manufactureDate': this.manufactureDate.value,
      'expiryDate': this.expiryDate.value,
      'dateOfSale': this.dateOfSale.value,
      'amount': this.amount.value,
      'price': this.price.value,
      'activeChemicals': this.activeChemicals.value,
      'certification': this.certification.value,
      'currentOwner': this.currentOwner.value,
      'issuer': this.issuer.value
    };

    this.myForm.setValue({
      'pesticideId': null,
      'name': null,
      'manufactureDate': null,
      'expiryDate': null,
      'dateOfSale': null,
      'amount': null,
      'price': null,
      'activeChemicals': null,
      'certification': null,
      'currentOwner': null,
      'issuer': null
    });

    return this.servicePesticide.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'pesticideId': null,
        'name': null,
        'manufactureDate': null,
        'expiryDate': null,
        'dateOfSale': null,
        'amount': null,
        'price': null,
        'activeChemicals': null,
        'certification': null,
        'currentOwner': null,
        'issuer': null
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
      $class: 'org.ucsc.agriblockchain.Pesticide',
      'name': this.name.value,
      'manufactureDate': this.manufactureDate.value,
      'expiryDate': this.expiryDate.value,
      'dateOfSale': this.dateOfSale.value,
      'amount': this.amount.value,
      'price': this.price.value,
      'activeChemicals': this.activeChemicals.value,
      'certification': this.certification.value,
      'currentOwner': this.currentOwner.value,
      'issuer': this.issuer.value
    };

    return this.servicePesticide.updateAsset(form.get('pesticideId').value, this.asset)
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

    return this.servicePesticide.deleteAsset(this.currentId)
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

    return this.servicePesticide.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'pesticideId': null,
        'name': null,
        'manufactureDate': null,
        'expiryDate': null,
        'dateOfSale': null,
        'amount': null,
        'price': null,
        'activeChemicals': null,
        'certification': null,
        'currentOwner': null,
        'issuer': null
      };

      if (result.pesticideId) {
        formObject.pesticideId = result.pesticideId;
      } else {
        formObject.pesticideId = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.manufactureDate) {
        formObject.manufactureDate = result.manufactureDate;
      } else {
        formObject.manufactureDate = null;
      }

      if (result.expiryDate) {
        formObject.expiryDate = result.expiryDate;
      } else {
        formObject.expiryDate = null;
      }

      if (result.dateOfSale) {
        formObject.dateOfSale = result.dateOfSale;
      } else {
        formObject.dateOfSale = null;
      }

      if (result.amount) {
        formObject.amount = result.amount;
      } else {
        formObject.amount = null;
      }

      if (result.price) {
        formObject.price = result.price;
      } else {
        formObject.price = null;
      }

      if (result.activeChemicals) {
        formObject.activeChemicals = result.activeChemicals;
      } else {
        formObject.activeChemicals = null;
      }

      if (result.certification) {
        formObject.certification = result.certification;
      } else {
        formObject.certification = null;
      }

      if (result.currentOwner) {
        formObject.currentOwner = result.currentOwner;
      } else {
        formObject.currentOwner = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer;
      } else {
        formObject.issuer = null;
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
      'pesticideId': null,
      'name': null,
      'manufactureDate': null,
      'expiryDate': null,
      'dateOfSale': null,
      'amount': null,
      'price': null,
      'activeChemicals': null,
      'certification': null,
      'currentOwner': null,
      'issuer': null
      });
  }

}
