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
import { SeedService } from './Seed.service';
import 'rxjs/add/operator/toPromise';
import $ from 'jquery';
import { StakeholderService } from '../Stakeholder/Stakeholder.service';
import { FileHolder } from 'angular2-image-upload';
import swal from 'sweetalert2';

@Component({
  selector: 'app-seed',
  templateUrl: './Seed.component.html',
  styleUrls: ['./Seed.component.css'],
  providers: [SeedService, StakeholderService]
})
export class SeedComponent implements OnInit {

  myForm: FormGroup;
  viewForm: FormGroup;
  certImagesFormArr: FormArray;
  chemFormArr: FormArray;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;
  private certificationImages = [];
  private availParticipants = [];
  private availCertification = [];
  private availSeedProviders = [];
  private uploadCertImages = [];
  private toggleLoad;
  private certiicationComment = [];
  private chemicals = [];
  private productTypes = ['CARROT', 'TOMATO', 'PINEAPPLE'];  

  seedId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  manufactureDate = new FormControl('', Validators.required);
  expiryDate = new FormControl('', Validators.required);
  dateOfSale = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  amount = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  activeChemicals = new FormControl('', Validators.required);
  certification = new FormControl('', Validators.required);
  currentOwner = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);

  certificationNo = new FormControl('');
  certificationBody = new FormControl('');
  from = new FormControl('');
  to = new FormControl('');
  certiImages = new FormControl('');
  certiComments = new FormControl('');

  parentProduct;
  divideStatus;
  activeStatus;

  constructor(public serviceSeed: SeedService, private fb: FormBuilder, public serviceStakeholder : StakeholderService) {
    this.myForm = fb.group({
      seedId: this.seedId,
      name: this.name,
      manufactureDate: this.manufactureDate,
      expiryDate: this.expiryDate,
      dateOfSale: this.dateOfSale,
      type: this.type,
      amount: this.amount,
      price: this.price,
      activeChemicals: this.activeChemicals,
      currentOwner: this.currentOwner,
      issuer: this.issuer,
      certification : this.certification,
      certificationNo : this.certificationNo,
      certificationBody : this.certificationBody,
      from : this.from,
      to : this.to,
      certImagesFormArr : fb.array([]),
      certiComments : this.certiComments,
      chemFormArr : fb.array([]),
    });

    this.viewForm = fb.group({
      seedId: this.seedId,
      name: this.name,
      manufactureDate: this.manufactureDate,
      expiryDate: this.expiryDate,
      dateOfSale: this.dateOfSale,
      type: this.type,
      amount: this.amount,
      price: this.price,
      activeChemicals: this.activeChemicals,
      currentOwner: this.currentOwner,
      issuer: this.issuer,
      certification : this.certification,
      certificationNo : this.certificationNo,
      certificationBody : this.certificationBody,
      from : this.from,
      to : this.to,
      certiImages : this.certiImages,
      certiComments : this.certiComments,
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
    return this.serviceSeed.getAll()
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

        if(String(asset.type) == "CERTIFICATION"){
          this.availCertification.push(asset);
        }  
        
        if(String(asset.type) == "SEED"){
          this.availSeedProviders.push(asset);
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
    
    let certImageArr = this.myForm.value['certImagesFormArr'];
    let certImages = [];

    certImageArr.forEach((image)=>{
      let item = image.image;
      certImages.push(item);
    });

    let chemArr = this.myForm.value['chemFormArr'];
    let chemicals = [];

    chemArr.forEach((chem)=>{
      let item = chem.chemical;
      chemicals.push(item);
    });

    let certi = {
      $class: "org.ucsc.agriblockchain.Certification",
      "certificationNo": this.certificationNo.value,
      "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + this.certificationBody.value,
      "from": this.from.value,
      "to": this.to.value,
      "images": certImages,
    }

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Seed',
      'seedId': this.seedId.value,
      'name': this.name.value,
      'manufactureDate': this.manufactureDate.value,
      'expiryDate': this.expiryDate.value,
      'dateOfSale': this.dateOfSale.value,
      'type': this.type.value,
      'amount': this.amount.value,
      'price': this.price.value,
      'activeChemicals': chemicals,
      'certification': certi,
      'currentOwner': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.currentOwner.value,
      'issuer': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.issuer.value,
      'divideStatus': 'ORIGINAL',
      'activeStatus': 'ACTIVE'
    };

    return this.toggleLoad = this.serviceSeed.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;   

      this.loadAll();
      swal(
        'Success!',
        'Seeds added successfully!',
        'success'
      )
      $('#addAssetModal .close').trigger('click');
      $('.loader').hide();
      $('.word').show();
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
    $('.loader').show();
    $('.word').hide();

    let parent = "";
    let certImageArr = this.myForm.value['certImagesFormArr'];
    let certImages = [];

    certImageArr.forEach((image)=>{
      let item = image.image;
      certImages.push(item);
    });

    let chemArr = this.myForm.value['chemFormArr'];
    let chemicals = [];

    chemArr.forEach((chem)=>{
      let item = chem.chemical;
      chemicals.push(item);
    });

    let certi = {
      $class: "org.ucsc.agriblockchain.Certification",
      "certificationNo": this.certificationNo.value,
      "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + this.certificationBody.value,
      "from": this.from.value,
      "to": this.to.value,
      "images": certImages,
    }

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Seed',
      'name': this.name.value,
      'manufactureDate': this.manufactureDate.value,
      'expiryDate': this.expiryDate.value,
      'dateOfSale': this.dateOfSale.value,
      'type': this.type.value,
      'amount': this.amount.value,
      'price': this.price.value,
      'activeChemicals': chemicals,
      'certification': certi,
      'currentOwner': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.currentOwner.value,
      'issuer': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.issuer.value,
      'divideStatus': this.divideStatus,
      'activeStatus': this.activeStatus,
    };

    if(this.parentProduct != "") {                        
      this.asset.parentProduct = this.parentProduct;   
    }

    return this.toggleLoad = this.serviceSeed.updateAsset(form.get('seedId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();

      $('#updateAssetModal .close').trigger('click');
      swal(
        'Success!',
        'Seeds updated successfully!',
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

    return this.serviceSeed.deleteAsset(this.currentId)
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
    $('#update1').trigger('click');

    return this.serviceSeed.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'seedId': null,
        'name': null,
        'manufactureDate': null,
        'expiryDate': null,
        'dateOfSale': null,
        'type': null,
        'amount': null,
        'price': null,
        'activeChemicals': null,
        'currentOwner': null,
        'issuer': null,
        'certification' : null,
        'certificationNo' : null,
        'certificationBody' : null,
        'from' : null,
        'to' : null,
        'certiComments' : null,
        'certImagesFormArr' : null,
        'chemFormArr' : null,
        'parentProduct': null,
        'divideStatus': null,
        'activeStatus': null
      };

      if (result.seedId) {
        formObject.seedId = result.seedId;
      } else {
        formObject.seedId = null;
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

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
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
        this.myForm.setControl('chemFormArr', this.fb.array([]));

        formObject.chemFormArr = this.myForm.get('chemFormArr') as FormArray;;   
        
        this.chemicals = result.activeChemicals;

        this.chemicals.forEach(chem=>{    
          formObject.chemFormArr.push(
            this.fb.group({
              chemical: chem
            })
          ); 
        });
      } else {
        formObject.activeChemicals = null;
      }

      if (result.certification) {
        formObject.certification = result.certification;
        formObject.certificationNo = result.certification.certificationNo;
        formObject.certificationBody = result.certification.certificationBody.stakeholderId;
        formObject.from = result.certification.from;
        formObject.to = result.certification.to;        
        formObject.certiComments = result.certification.comment;

        this.certiicationComment = result.certification.comment;

        this.myForm.setControl('certImagesFormArr', this.fb.array([]));
        formObject.certImagesFormArr = this.myForm.get('certImagesFormArr') as FormArray;   
        
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

      if (result.currentOwner) {
        formObject.currentOwner = result.currentOwner.stakeholderId;
      } else {
        formObject.currentOwner = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer.stakeholderId;
      } else {
        formObject.issuer = null;
      }

      if (result.parentProduct) {
        formObject.parentProduct = result.parentProduct;
        this.parentProduct = result.parentProduct;
      } else {
        formObject.parentProduct = null;
      }

      if (result.divideStatus) {
        formObject.divideStatus = result.divideStatus;
        this.divideStatus = result.divideStatus;
      } else {
        formObject.divideStatus = null;
      }

      if (result.activeStatus) {
        formObject.activeStatus = result.activeStatus;
        this.activeStatus = result.activeStatus;
      } else {
        formObject.activeStatus = null;
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
    $('#view1').trigger('click');

    return this.serviceSeed.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'seedId': null,
        'name': null,
        'manufactureDate': null,
        'expiryDate': null,
        'dateOfSale': null,
        'type': null,
        'amount': null,
        'price': null,
        'activeChemicals': null,
        'currentOwner': null,
        'issuer': null,
        'certification' : null,
        'certificationNo' : null,
        'certificationBody' : null,
        'from' : null,
        'to' : null,
        'certiComments' : null,
        'certiImages' : null
      };

      if (result.seedId) {
        formObject.seedId = result.seedId;
      } else {
        formObject.seedId = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.manufactureDate) {
        formObject.manufactureDate = result.manufactureDate.toString().split('T')[0];
      } else {
        formObject.manufactureDate = null;
      }

      if (result.expiryDate) {
        formObject.expiryDate = result.expiryDate.toString().split('T')[0];
      } else {
        formObject.expiryDate = null;
      }

      if (result.dateOfSale) {
        formObject.dateOfSale = result.dateOfSale.toString().split('T')[0];
      } else {
        formObject.dateOfSale = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
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

        this.chemicals = result.activeChemicals;
      } else {
        formObject.activeChemicals = null;
      }

      if (result.certification) {
        formObject.certification = result.certification;
        formObject.certificationNo = result.certification.certificationNo;
        formObject.certificationBody = result.certification.certificationBody.name;
        formObject.from = result.certification.from.toString().split('T')[0];
        formObject.to = result.certification.to.toString().split('T')[0];     
        formObject.certiComments = result.certification.comment;
        formObject.certiImages = result.certification.images;

        this.certiicationComment = result.certification.comment;
        this.certificationImages = result.certification.images;
        
      } else {
        formObject.certification = null;
      }

      if (result.currentOwner) {
        formObject.currentOwner = result.currentOwner.name;
      } else {
        formObject.currentOwner = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer.name;
      } else {
        formObject.issuer = null;
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

    this.myForm.setValue({
      'seedId': null,
      'name': null,
      'manufactureDate': null,
      'expiryDate': null,
      'dateOfSale': null,
      'type': null,
      'amount': null,
      'price': null,
      'activeChemicals': null,
      'currentOwner': null,
      'issuer': null,
      'certification' : null,
      'certificationNo' : null,
      'certificationBody' : null,
      'from' : null,
      'to' : null,
      'certiComments' : null,
      'certImagesFormArr' : null,
      'chemFormArr' : null
      });
  }

  onCertChange(event) {
    const reader = new FileReader();    
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      let form = this.myForm.get('certImagesFormArr') as FormArray;
      
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

    let fArray = <FormArray>this.myForm.controls['certImagesFormArr'];
    fArray.removeAt(index);  
  }

 

  addField(){
    this.chemFormArr = this.myForm.get('chemFormArr') as FormArray;
    this.chemFormArr.push(this.addChemical());      
  }

  addChemical() : FormGroup{
    return this.fb.group({
      chemical: ''
    });
  }

  removeField(index){
    let fArray = <FormArray>this.myForm.controls['chemFormArr'];
    fArray.removeAt(index);
  }

}
