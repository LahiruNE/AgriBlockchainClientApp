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
import { ProductService } from './Product.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-product',
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.css'],
  providers: [ProductService]
})
export class ProductComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  productId = new FormControl('', Validators.required);
  pluckedDate = new FormControl('', Validators.required);
  certification = new FormControl('', Validators.required);
  productType = new FormControl('', Validators.required);
  quantity = new FormControl('', Validators.required);
  unit = new FormControl('', Validators.required);
  divideStatus = new FormControl('', Validators.required);
  activeStatus = new FormControl('', Validators.required);
  productpath = new FormControl('', Validators.required);
  plot = new FormControl('', Validators.required);
  parentProduct = new FormControl('', Validators.required);
  currentOwner = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);

  constructor(public serviceProduct: ProductService, fb: FormBuilder) {
    this.myForm = fb.group({
      productId: this.productId,
      pluckedDate: this.pluckedDate,
      certification: this.certification,
      productType: this.productType,
      quantity: this.quantity,
      unit: this.unit,
      divideStatus: this.divideStatus,
      activeStatus: this.activeStatus,
      productpath: this.productpath,
      plot: this.plot,
      parentProduct: this.parentProduct,
      currentOwner: this.currentOwner,
      issuer: this.issuer
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceProduct.getAll()
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
      $class: 'org.ucsc.agriblockchain.Product',
      'productId': this.productId.value,
      'pluckedDate': this.pluckedDate.value,
      'certification': this.certification.value,
      'productType': this.productType.value,
      'quantity': this.quantity.value,
      'unit': this.unit.value,
      'divideStatus': this.divideStatus.value,
      'activeStatus': this.activeStatus.value,
      'productpath': this.productpath.value,
      'plot': this.plot.value,
      'parentProduct': this.parentProduct.value,
      'currentOwner': this.currentOwner.value,
      'issuer': this.issuer.value
    };

    this.myForm.setValue({
      'productId': null,
      'pluckedDate': null,
      'certification': null,
      'productType': null,
      'quantity': null,
      'unit': null,
      'divideStatus': null,
      'activeStatus': null,
      'productpath': null,
      'plot': null,
      'parentProduct': null,
      'currentOwner': null,
      'issuer': null
    });

    return this.serviceProduct.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'productId': null,
        'pluckedDate': null,
        'certification': null,
        'productType': null,
        'quantity': null,
        'unit': null,
        'divideStatus': null,
        'activeStatus': null,
        'productpath': null,
        'plot': null,
        'parentProduct': null,
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
      $class: 'org.ucsc.agriblockchain.Product',
      'pluckedDate': this.pluckedDate.value,
      'certification': this.certification.value,
      'productType': this.productType.value,
      'quantity': this.quantity.value,
      'unit': this.unit.value,
      'divideStatus': this.divideStatus.value,
      'activeStatus': this.activeStatus.value,
      'productpath': this.productpath.value,
      'plot': this.plot.value,
      'parentProduct': this.parentProduct.value,
      'currentOwner': this.currentOwner.value,
      'issuer': this.issuer.value
    };

    return this.serviceProduct.updateAsset(form.get('productId').value, this.asset)
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

    return this.serviceProduct.deleteAsset(this.currentId)
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

    return this.serviceProduct.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'productId': null,
        'pluckedDate': null,
        'certification': null,
        'productType': null,
        'quantity': null,
        'unit': null,
        'divideStatus': null,
        'activeStatus': null,
        'productpath': null,
        'plot': null,
        'parentProduct': null,
        'currentOwner': null,
        'issuer': null
      };

      if (result.productId) {
        formObject.productId = result.productId;
      } else {
        formObject.productId = null;
      }

      if (result.pluckedDate) {
        formObject.pluckedDate = result.pluckedDate;
      } else {
        formObject.pluckedDate = null;
      }

      if (result.certification) {
        formObject.certification = result.certification;
      } else {
        formObject.certification = null;
      }

      if (result.productType) {
        formObject.productType = result.productType;
      } else {
        formObject.productType = null;
      }

      if (result.quantity) {
        formObject.quantity = result.quantity;
      } else {
        formObject.quantity = null;
      }

      if (result.unit) {
        formObject.unit = result.unit;
      } else {
        formObject.unit = null;
      }

      if (result.divideStatus) {
        formObject.divideStatus = result.divideStatus;
      } else {
        formObject.divideStatus = null;
      }

      if (result.activeStatus) {
        formObject.activeStatus = result.activeStatus;
      } else {
        formObject.activeStatus = null;
      }

      if (result.productpath) {
        formObject.productpath = result.productpath;
      } else {
        formObject.productpath = null;
      }

      if (result.plot) {
        formObject.plot = result.plot;
      } else {
        formObject.plot = null;
      }

      if (result.parentProduct) {
        formObject.parentProduct = result.parentProduct;
      } else {
        formObject.parentProduct = null;
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
      'productId': null,
      'pluckedDate': null,
      'certification': null,
      'productType': null,
      'quantity': null,
      'unit': null,
      'divideStatus': null,
      'activeStatus': null,
      'productpath': null,
      'plot': null,
      'parentProduct': null,
      'currentOwner': null,
      'issuer': null
      });
  }

}
