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
import { FarmService } from './Farm.service';
import 'rxjs/add/operator/toPromise';
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';

@Component({
  selector: 'app-farm',
  templateUrl: './Farm.component.html',
  styleUrls: ['./Farm.component.css'],
  providers: [FarmService]
})
export class FarmComponent implements OnInit {

  myForm: FormGroup;
  viewForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;
  private certiicationComment = [];
  private farmersArr = [];
  private farmImages = [];
  private certificationImages = [];

  private userType = this.localStorageService.getFromLocal('currentUser').type;

  farmId = new FormControl('', Validators.required);
  FarmLocation = new FormControl('', Validators.required);
  images = new FormControl('', Validators.required);
  waterSources = new FormControl('', Validators.required);
  nearFactories = new FormControl('', Validators.required);
  otherDescription = new FormControl('', Validators.required);
  certification = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  farmers = new FormControl('');

  nearFactoriesN = new FormControl('');
  nearFactoriesS = new FormControl('');
  nearFactoriesE = new FormControl('');
  nearFactoriesW = new FormControl('');

  waterSourcesN = new FormControl('');
  waterSourcesS = new FormControl('');
  waterSourcesE = new FormControl('');
  waterSourcesW = new FormControl('');

  certificationNo = new FormControl('');
  certificationBody = new FormControl('');
  from = new FormControl('');
  to = new FormControl('');
  certiImages = new FormControl('');
  certiComments = new FormControl(''); 


  constructor(private localStorageService: LocalStorageService, public serviceFarm: FarmService, fb: FormBuilder) {
    this.myForm = fb.group({
      farmId: this.farmId,
      FarmLocation: this.FarmLocation,
      images: this.images,
      waterSources: this.waterSources,
      nearFactories: this.nearFactories,
      otherDescription: this.otherDescription,
      certification: this.certification,
      owner: this.owner
    });

    this.viewForm = fb.group({
      farmId: this.farmId,
      FarmLocation: this.FarmLocation,
      images: this.images,
      waterSources: this.waterSources,
      nearFactories: this.nearFactories,
      otherDescription: this.otherDescription,
      certification: this.certification,
      owner: this.owner,
      waterSourcesN : this.waterSourcesN,
      waterSourcesS : this.waterSourcesS,
      waterSourcesE : this.waterSourcesE,
      waterSourcesW : this.waterSourcesW,
      nearFactoriesN : this.nearFactoriesN,
      nearFactoriesS : this.nearFactoriesS,
      nearFactoriesE : this.nearFactoriesE,
      nearFactoriesW : this.nearFactoriesW,
      certificationNo : this.certificationNo,
      certificationBody : this.certificationBody,
      from : this.from,
      to : this.to,
      certiImages : this.certiImages,
      certiComments : this.certiImages,
      farmers : this.farmers,
    });
  };

  ngOnInit(): void {
    
    this.loadAll();   
    var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
                $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('#stage1').trigger('click');
      
 
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceFarm.getAll()
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
      $class: 'org.ucsc.agriblockchain.Farm',
      'farmId': this.farmId.value,
      'FarmLocation': this.FarmLocation.value,
      'images': this.images.value,
      'waterSources': this.waterSources.value,
      'nearFactories': this.nearFactories.value,
      'otherDescription': this.otherDescription.value,
      'certification': this.certification.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'farmId': null,
      'FarmLocation': null,
      'images': null,
      'waterSources': null,
      'nearFactories': null,
      'otherDescription': null,
      'certification': null,
      'owner': null
    });

    return this.serviceFarm.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'farmId': null,
        'FarmLocation': null,
        'images': null,
        'waterSources': null,
        'nearFactories': null,
        'otherDescription': null,
        'certification': null,
        'owner': null
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
      $class: 'org.ucsc.agriblockchain.Farm',
      'FarmLocation': this.FarmLocation.value,
      'images': this.images.value,
      'waterSources': this.waterSources.value,
      'nearFactories': this.nearFactories.value,
      'otherDescription': this.otherDescription.value,
      'certification': this.certification.value,
      'owner': this.owner.value
    };

    return this.serviceFarm.updateAsset(form.get('farmId').value, this.asset)
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

    return this.serviceFarm.deleteAsset(this.currentId)
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

    return this.serviceFarm.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'farmId': null,
        'FarmLocation': null,
        'images': null,
        'waterSources': null,
        'nearFactories': null,
        'otherDescription': null,
        'certification': null,
        'owner': null
      };

      if (result.farmId) {
        formObject.farmId = result.farmId;
      } else {
        formObject.farmId = null;
      }

      if (result.FarmLocation) {
        formObject.FarmLocation = result.FarmLocation;
      } else {
        formObject.FarmLocation = null;
      }

      if (result.images) {
        formObject.images = result.images;
      } else {
        formObject.images = null;
      }

      if (result.waterSources) {
        formObject.waterSources = result.waterSources;
      } else {
        formObject.waterSources = null;
      }

      if (result.nearFactories) {
        formObject.nearFactories = result.nearFactories;
      } else {
        formObject.nearFactories = null;
      }

      if (result.otherDescription) {
        formObject.otherDescription = result.otherDescription;
      } else {
        formObject.otherDescription = null;
      }

      if (result.certification) {
        formObject.certification = result.certification;
      } else {
        formObject.certification = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
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

  getFormForView(id: any): Promise<any> {

    return this.serviceFarm.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'farmId': null,
        'FarmLocation': null,
        'images': null,
        'waterSources': null,
        'nearFactories': null,
        'otherDescription': null,
        'certification': null,
        'owner': null,
        'nearFactoriesN': null,
        'nearFactoriesS': null,
        'nearFactoriesE': null,
        'nearFactoriesW': null,
        'waterSourcesN': null,
        'waterSourcesS': null,
        'waterSourcesE': null,
        'waterSourcesW': null,
        'certificationNo' : null,
        'certificationBody' : null,
        'from' : null,
        'to' : null,
        'certiImages' : null,
        'certiComments' : null,
        'farmers' : null,
      };

      if (result.farmId) {
        formObject.farmId = result.farmId;
      } else {
        formObject.farmId = null;
      }

      if (result.FarmLocation) {
        formObject.FarmLocation = result.FarmLocation;
      } else {
        formObject.FarmLocation = null;
      }

      if (result.images) {
        formObject.images = result.images;

        this.farmImages = result.images;


      } else {
        formObject.images = null;
      }

      if (result.waterSources) {
        formObject.waterSourcesN = result.waterSources.North;
        formObject.waterSourcesS = result.waterSources.South;
        formObject.waterSourcesE = result.waterSources.East;
        formObject.waterSourcesW = result.waterSources.West;
      } else {
        formObject.waterSources = null;
      }

      if (result.nearFactories) {
        formObject.nearFactoriesN = result.nearFactories.North;
        formObject.nearFactoriesS = result.nearFactories.South;
        formObject.nearFactoriesE = result.nearFactories.East;
        formObject.nearFactoriesW = result.nearFactories.South;
      } else {
        formObject.nearFactories = null;
      }

      if (result.otherDescription) {
        formObject.otherDescription = result.otherDescription;
      } else {
        formObject.otherDescription = null;
      }

      if (result.certification) {
        formObject.certification = result.certification;
        formObject.certificationNo = result.certification.certificationNo;
        formObject.certificationBody = result.certification.certificationBody.name;
        formObject.from = result.certification.from.toString().split('T')[0];
        formObject.to = result.certification.to.toString().split('T')[0];
        formObject.certiImages = result.certification.images;
        formObject.certiComments = result.certification.comment;

        this.certiicationComment = result.certification.comment;
        this.certificationImages = result.certification.images;
        
      } else {
        formObject.certification = null;
      }

      if (result.owner) {
        formObject.owner = result.owner.name;
      } else {
        formObject.owner = null;
      }

      if (result.farmers) {
        formObject.farmers = result.farmers;

        this.farmersArr = result.farmers;
      } else {
        formObject.farmers = null;
      }

      this.viewForm.setValue(formObject);

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
      'farmId': null,
      'FarmLocation': null,
      'images': null,
      'waterSources': null,
      'nearFactories': null,
      'otherDescription': null,
      'certification': null,
      'owner': null
      });
  } 

}
