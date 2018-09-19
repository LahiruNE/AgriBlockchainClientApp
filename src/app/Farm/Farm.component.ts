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
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { FarmService } from './Farm.service';
import 'rxjs/add/operator/toPromise';
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';
import { StakeholderService } from '../Stakeholder/Stakeholder.service';
import { FileHolder } from 'angular2-image-upload';
import swal from 'sweetalert2';

@Component({
  selector: 'app-farm',
  templateUrl: './Farm.component.html',
  styleUrls: ['./Farm.component.css'],
  providers: [FarmService,StakeholderService]
})
export class FarmComponent implements OnInit {

  myForm: FormGroup;
  viewForm: FormGroup;
  updateForm: FormGroup;
  farmersFormArr: FormArray;
  imagesFormArr: FormArray;
  certImagesFormArr: FormArray;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;
  private certiicationComment = [];
  private farmersArr = [];
  private farmImages = [];
  private certificationImages = [];
  private availParticipants = [];
  private availCertification = [];
  private availFarmer = [];
  private uploadImages = [];
  private uploadCertImages = [];
  private toggleLoad;

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


  constructor(private localStorageService: LocalStorageService, public serviceFarm: FarmService, public serviceStakeholder : StakeholderService, private fb: FormBuilder) {
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
      certiComments : this.certiComments,
      farmers : this.farmers,
    });

    this.updateForm = fb.group({
      farmId: this.farmId,
      FarmLocation: this.FarmLocation,
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
      certImagesFormArr : fb.array([]),
      certiComments : this.certiComments,
      farmersFormArr: fb.array([]),
      imagesFormArr : fb.array([]),
    });
  };

  ngOnInit(): void {    
    this.loadAll();
    this.loadParticipants();

    //setup wizard   
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
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().parent().next().children("div").children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
          console.log(curInputs[i]);
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid)
            nextStepWizard.trigger('click');
    });

    
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

  loadParticipants(): Promise<any>{
    const tempList = [];
    return this.serviceStakeholder.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        this.availParticipants.push(asset);

        if(String(asset.type) == "FARMER"){
          this.availFarmer.push(asset);
        }

        if(String(asset.type) == "CERTIFICATION"){
          this.availCertification.push(asset);
        }        

      });

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

  addAsset(form: any) { 
    $('.loader').show();
    $('.word').hide();

    let imageArr = this.updateForm.value['imagesFormArr'];
    let images = [];

    imageArr.forEach((image)=>{
      let item = image.image;
      images.push(item);
    });

    let certImageArr = this.updateForm.value['certImagesFormArr'];
    let certImages = [];

    certImageArr.forEach((image)=>{
      let item = image.image;
      certImages.push(item);
    });

    let farmersArr = this.updateForm.value['farmersFormArr'];
    let farmers = [];

    farmersArr.forEach((farmer)=>{
      let item = farmer.farmer;
      farmers.push("resource:org.ucsc.agriblockchain.Stakeholder#" + item);
    }); 

    let water = {
        $class : "org.ucsc.agriblockchain.Directions",
        "North": this.waterSourcesN.value,
        "East": this.waterSourcesE.value,
        "South": this.waterSourcesS.value,
        "West": this.waterSourcesW.value     
    }

    let factory = {
      $class: "org.ucsc.agriblockchain.Directions",
      "North": this.nearFactoriesN.value,
      "East": this.nearFactoriesE.value,
      "South": this.nearFactoriesS.value,
      "West": this.nearFactoriesW.value
    }

    let certi = {
      $class: "org.ucsc.agriblockchain.Certification",
      "certificationNo": this.certificationNo.value,
      "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + this.certificationBody.value,
      "from": this.from.value,
      "to": this.to.value,
      "images": certImages,
    }

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Farm',
      "farmId": this.farmId.value,
      'FarmLocation': this.FarmLocation.value,
      'images': images,
      'waterSources': water,
      'nearFactories': factory,
      'otherDescription': this.otherDescription.value,
      'certification': certi,
      'owner': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.owner.value,
      'farmers' : farmers
    }; 

    return this.toggleLoad = this.serviceFarm.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();

      $('#addAssetModal .close').trigger('click');
      swal(
        'Success!',
        'Farm is added successfully!',
        'success'
      )
      $('.loader').hide();
      $('.word').show();
      
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

  

  updateAsset(form: any)  { 

    $('.loader').show();
    $('.word').hide();

    let imageArr = this.updateForm.value['imagesFormArr'];
    let images = [];

    imageArr.forEach((image)=>{
      let item = image.image;
      images.push(item);
    });

    let certImageArr = this.updateForm.value['certImagesFormArr'];
    let certImages = [];

    certImageArr.forEach((image)=>{
      let item = image.image;
      certImages.push(item);
    });

    let farmersArr = this.updateForm.value['farmersFormArr'];
    let farmers = [];

    farmersArr.forEach((farmer)=>{
      let item = farmer.farmer;
      farmers.push(item);
    });

    let water = {
        $class : "org.ucsc.agriblockchain.Directions",
        "North": this.waterSourcesN.value,
        "East": this.waterSourcesE.value,
        "South": this.waterSourcesS.value,
        "West": this.waterSourcesW.value     
    }

    let factory = {
      $class: "org.ucsc.agriblockchain.Directions",
      "North": this.nearFactoriesN.value,
      "East": this.nearFactoriesE.value,
      "South": this.nearFactoriesS.value,
      "West": this.nearFactoriesW.value
    }

    let certi = {
      $class: "org.ucsc.agriblockchain.Certification",
      "certificationNo": this.certificationNo.value,
      "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + this.certificationBody.value,
      "from": this.from.value,
      "to": this.to.value,
      "images": certImages,
    }

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Farm',
      'FarmLocation': this.FarmLocation.value,
      'images': images,
      'waterSources': water,
      'nearFactories': factory,
      'otherDescription': this.otherDescription.value,
      'certification': certi,
      'owner': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.owner.value,
      'farmers' : farmers
    };


    return this.toggleLoad = this.serviceFarm.updateAsset(form.get('farmId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();

      $('#updateAssetModal .close').trigger('click');
      swal(
        'Success!',
        'Farm is updated successfully!',
        'success'
      )
      $('.loader').hide();
      $('.word').show();
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

  getFormForUpdate(id: any): Promise<any> {
    $('#update1').trigger('click');
    this.uploadImages = [];
    this.uploadCertImages = [];

    return this.serviceFarm.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'farmId': null,
        'FarmLocation': null,
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
        'certiComments' : null,
        'farmersFormArr' : null,
        'imagesFormArr' : null,
        'certImagesFormArr' : null
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
        this.updateForm.setControl('imagesFormArr', this.fb.array([]));
        formObject.imagesFormArr = this.updateForm.get('imagesFormArr') as FormArray;;   
        
        this.uploadImages = result.images;
        this.uploadImages.forEach(image=>{    
          formObject.imagesFormArr.push(
            this.fb.group({
              image: image 
            })
          ); 
        });

      } else {
        formObject.imagesFormArr = null;
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
        formObject.certificationBody = result.certification.certificationBody.stakeholderId;
        formObject.from = result.certification.from;
        formObject.to = result.certification.to;        
        formObject.certiComments = result.certification.comment;

        this.certiicationComment = result.certification.comment;

        this.updateForm.setControl('certImagesFormArr', this.fb.array([]));
        formObject.certImagesFormArr = this.updateForm.get('certImagesFormArr') as FormArray;;   
        
        this.uploadCertImages = result.certification.images;

        this.uploadCertImages.forEach(image=>{    
          formObject.certImagesFormArr.push(
            this.fb.group({
              image: image 
            })
          ); 
        });
        
      } else {
        formObject.certification = null;
      }

      if (result.owner) {
        formObject.owner = result.owner.stakeholderId;
      } else {
        formObject.owner = null;
      }

      if (result.farmers) {
        this.updateForm.setControl('farmersFormArr', this.fb.array([]));

        formObject.farmersFormArr = this.updateForm.get('farmersFormArr') as FormArray;;   
        
        this.farmersArr = result.farmers;

        this.farmersArr.forEach(farmer=>{    
          formObject.farmersFormArr.push(
            this.fb.group({
              farmer: farmer.stakeholderId
            })
          ); 
        });
      } else {
        formObject.farmersFormArr = null;
      }
      this.updateForm.setValue(formObject); 

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
    $('#stage1').trigger('click');

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
    $('#add1').trigger('click');
    this.updateForm.setControl('certImagesFormArr', this.fb.array([]));
    this.updateForm.setControl('farmersFormArr', this.fb.array([]));
    this.updateForm.setControl('imagesFormArr', this.fb.array([]));

      this.updateForm.setValue({
        'farmId': null,
        'FarmLocation': null,
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
        'certiComments' : null,
        'farmersFormArr' : null,
        'imagesFormArr' : null,
        'certImagesFormArr' : null
        });
  } 

  addField(){
    this.farmersFormArr = this.updateForm.get('farmersFormArr') as FormArray;
    this.farmersFormArr.push(this.addFarmer());      
  }

  addFarmer() : FormGroup{
    return this.fb.group({
      farmer: ''
    });
  }

  removeField(index){
    let fArray = <FormArray>this.updateForm.controls['farmersFormArr'];
    fArray.removeAt(index);
  }

  onFileChange(event) {
    const reader = new FileReader();    
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      let form = this.updateForm.get('imagesFormArr') as FormArray;
      
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.uploadImages.push(reader.result);
        form.push(
          this.fb.group({
            image: reader.result 
          })
        );  
      };          
    } 
    
  }

  onCertChange(event) {
    const reader = new FileReader();    
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      let form = this.updateForm.get('certImagesFormArr') as FormArray;
      
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.uploadCertImages.push(reader.result);
        form.push(
          this.fb.group({
            image: reader.result 
          })
        );  
      };          
    } 
    
  }

  onCertRemoved(file: FileHolder) {
    var index = this.uploadCertImages.indexOf(file.src);
    this.uploadCertImages.splice(index,1); 

    let fArray = <FormArray>this.updateForm.controls['certImagesFormArr'];
    fArray.removeAt(index);  
  }

  onRemoved(file: FileHolder) {
    var index = this.uploadImages.indexOf(file.src);
    this.uploadImages.splice(index,1); 

    let fArray = <FormArray>this.updateForm.controls['imagesFormArr'];
    fArray.removeAt(index);  
  }
}
