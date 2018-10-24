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
import { ProductService } from '../Product/Product.service';
import 'rxjs/add/operator/toPromise';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import $ from 'jquery';
import { StakeholderService } from '../Stakeholder/Stakeholder.service';
import { FileHolder } from 'angular2-image-upload';
import swal from 'sweetalert2';
import { PlotService } from '../Plot/Plot.service';
import { TransferPackageService } from './TransferPackage.service';
import { DataService } from '../data.service';
import { Product } from '../org.ucsc.agriblockchain';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-transferpackage',
  templateUrl: './TransferPackage.component.html',
  styleUrls: ['./TransferPackage.component.css'],
  providers: [TransferPackageService, ProductService, StakeholderService, PlotService, DataService]
})
export class TransferPackageComponent implements OnInit {

  myForm: FormGroup;
  transferForm: FormGroup;
  viewForm: FormGroup;
  certImagesFormArr: FormArray;

  private allAssets;
  private allPendingRequests;
  private allSubmittedRequests;
  private allProductIds;
  private Transaction;
  private currentId;
  private errorMessage;
  private productspath; 
  private stakename; 
  private asset;
  private certificationImages = [];
  private availParticipants = [];
  private availCertification = [];
  private availPlots = [];
  private uploadCertImages = [];
  private toggleLoad;
  private certiicationComment = [];
  private productTypes = ['CARROT', 'TOMATO', 'PINEAPPLE']; 
  private units = ['KG', 'G', 'MT', 'L', 'ML', 'ITEM'];

  productId = new FormControl('', Validators.required);
  pluckedDate = new FormControl('', Validators.required);
  certification = new FormControl('', Validators.required);
  productType = new FormControl('', Validators.required);
  quantity = new FormControl('', Validators.required);
  unit = new FormControl('', Validators.required);  
  plot = new FormControl('', Validators.required);
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
  productpath;

  product = new FormControl('', Validators.required);
  newOwner = new FormControl('', Validators.required);

  constructor(private localStorageService : LocalStorageService, private serviceTransferPackage: TransferPackageService, public servicePlot: PlotService, public serviceData: DataService<Product>, public serviceProduct: ProductService, private fb: FormBuilder,public serviceStakeholder : StakeholderService) {
    this.transferForm = fb.group({
      product: this.product,
      newOwner: this.newOwner
    });

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
      issuer: this.issuer,
      certificationNo : this.certificationNo,
      certificationBody : this.certificationBody,
      from : this.from,
      to : this.to,
      certImagesFormArr : fb.array([]),
      certiComments : this.certiComments,
    });

    this.viewForm = fb.group({
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
      issuer: this.issuer,
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
    this.loadOwnedProducts();
    this.loadPendingRequests();
    this.loadSubmittedRequests();
    this.loadOwnedProducts();
    this.loadParticipants();
    this.loadPlots();

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

  loadPendingRequests(): Promise<any> {
    const tempList = [];
    let user = "resource%3Aorg.ucsc.agriblockchain.Stakeholder%23" + this.localStorageService.getFromLocal('currentUser').stakeholderId;
    
    return this.serviceData.getPendingRequests(user)
    .toPromise()
    .then((result) => {

      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allPendingRequests = tempList;
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

  loadSubmittedRequests(): Promise<any> {
    const tempList = [];
    let user = "resource%3Aorg.ucsc.agriblockchain.Stakeholder%23" + this.localStorageService.getFromLocal('currentUser').stakeholderId;

    return this.serviceData.getSubmittedRequests(user)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allSubmittedRequests = tempList;
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

  loadOwnedProducts(): Promise<any> {
    const tempList = [];
    let user = "resource%3Aorg.ucsc.agriblockchain.Stakeholder%23" + this.localStorageService.getFromLocal('currentUser').stakeholderId;

    return this.serviceData.getOwnedProducts(user)
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

  loadPlots(): Promise<any>{
    const tempList = [];
    return this.servicePlot.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        this.availPlots.push(asset);
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


  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceProduct.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(product => {
        tempList.push(product.productId);
      });
      this.allProductIds = tempList;
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
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ucsc.agriblockchain.TransferPackage',
      'product': this.product.value,
      'newOwner': this.newOwner.value
    };

    this.transferForm.setValue({
      'product': null,
      'newOwner': null
    });

    return this.serviceTransferPackage.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'product': null,
        'newOwner': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ucsc.agriblockchain.TransferPackage',
      'product': this.product.value,
      'newOwner': this.newOwner.value,
    };

    return this.serviceTransferPackage.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  deleteTransaction(): Promise<any> {

    return this.serviceTransferPackage.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

    let certi = {
      $class: "org.ucsc.agriblockchain.Certification",
      "certificationNo": this.certificationNo.value,
      "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + this.certificationBody.value,
      "from": this.from.value,
      "to": this.to.value,
      "images": certImages,
    }

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Product',
      'pluckedDate': this.pluckedDate.value,
      'certification': certi,
      'productType': this.productType.value,
      'quantity': this.quantity.value,
      'unit': this.unit.value,
      'divideStatus': this.divideStatus,
      'activeStatus': this.activeStatus,
      'plot': "resource:org.ucsc.agriblockchain.Plot#" + this.plot.value,
      'currentOwner': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.currentOwner.value,
      'issuer': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.issuer.value,
    };

    if(this.parentProduct != "") {                        
      this.asset.parentProduct = this.parentProduct;   
    }

    if(this.productpath != "") {                        
      this.asset.productpath = this.productpath;   
    }

    return this.toggleLoad = this.serviceProduct.updateAsset(form.get('productId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadOwnedProducts();
      this.loadPendingRequests();
      this.loadAll();

      $('#updateAssetModal .close').trigger('click');
      swal(
        'Success!',
        'Product updated successfully!',
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

    return this.serviceProduct.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadOwnedProducts();
      this.loadPendingRequests();
      this.loadAll();

      swal(
        'Success!',
        'Product deleted successfully!',
        'success'
      )
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
        'issuer': null,
        'certificationNo' : null,
        'certificationBody' : null,
        'from' : null,
        'to' : null,
        'certiComments' : null,
        'certImagesFormArr' : null
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

      if (result.productpath) {
        formObject.productpath = result.productpath;
      } else {
        formObject.productpath = null;
      }

      if (result.plot) {
        formObject.plot = result.plot.plotId;
      } else {
        formObject.plot = null;
      }

      if (result.parentProduct) {
        formObject.parentProduct = result.parentProduct;
      } else {
        formObject.parentProduct = null;
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
        'issuer': null,
        'certificationNo' : null,
        'certificationBody' : null,
        'from' : null,
        'to' : null,
        'certiComments' : null,
        'certiImages' : null
      };

      if (result.productId) {
        formObject.productId = result.productId;
      } else {
        formObject.productId = null;
      }

      if (result.pluckedDate) {
        formObject.pluckedDate = result.pluckedDate.toString().split('T')[0];;
      } else {
        formObject.pluckedDate = null;
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
        formObject.plot = result.plot.plotId;
      } else {
        formObject.plot = null;
      }

      if (result.parentProduct) {
        formObject.parentProduct = result.parentProduct;
      } else {
        formObject.parentProduct = null;
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
      'issuer': null,
      'certificationNo' : null,
      'certificationBody' : null,
      'from' : null,
      'to' : null,
      'certiComments' : null,
      'certImagesFormArr' : null
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

  updateTransferDetails(type, id) {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Proceed!'
    }).then((result) => {
      if (result.value) {
        return this.toggleLoad = this.serviceProduct.getAsset(id)
        .toPromise()
        .then((result)=>{
          let error = 0;
          let userId = this.localStorageService.getFromLocal('currentUser').stakeholderId;

          let certi = {
            $class: "org.ucsc.agriblockchain.Certification",
            "certificationNo": result.certification.certificationNo,
            "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + result.certification.certificationBody.stakeholderId,
            "from": result.certification.from,
            "to": result.certification.to,
            "images": result.certification.images,
          }

          this.asset = {
            $class: 'org.ucsc.agriblockchain.Product',
            'pluckedDate': result.pluckedDate,
            'certification': certi,
            'productType': result.productType,
            'quantity': result.quantity,
            'unit': result.unit,
            'divideStatus': result.divideStatus,
            'activeStatus': result.activeStatus,
            'plot': "resource:org.ucsc.agriblockchain.Plot#" + result.plot.plotId,
          };
      
          if(this.parentProduct != "") {                        
            this.asset.parentProduct = result.parentProduct;   
          }
      
          if(this.productpath != "") {                        
            this.asset.productpath = result.productpath;   
          }

          if(type == 1){
            $('#loader1').show();
            $('.word1').hide();

            let trans = {
              $class: "org.ucsc.agriblockchain.TransferDetails",
              "status": "APPROVED",
              "comment": "",
              "invokedBy": "resource:org.ucsc.agriblockchain.Stakeholder#" + result.transferDetails.invokedBy.stakeholderId
            }

            this.asset.currentOwner = "resource:org.ucsc.agriblockchain.Stakeholder#" + result.transferDetails.invokedBy.stakeholderId;
            this.asset.issuer = "resource:org.ucsc.agriblockchain.Stakeholder#" + result.currentOwner.stakeholderId;

            this.asset.transferDetails = trans;
          }
          else if(type == 0){
            $('#loader0').show();
            $('.word0').hide();

            let trans = {
              $class: "org.ucsc.agriblockchain.TransferDetails",
              "status": "REJECTED",
              "comment": "",
              "invokedBy": "resource:org.ucsc.agriblockchain.Stakeholder#" + result.transferDetails.invokedBy.stakeholderId
            }

            this.asset.currentOwner = "resource:org.ucsc.agriblockchain.Stakeholder#" + result.currentOwner.stakeholderId;
            this.asset.issuer = "resource:org.ucsc.agriblockchain.Stakeholder#" + result.issuer.stakeholderId;

            this.asset.transferDetails = trans;
          }
          else if(type == 2){
            $('#loader2').show();
            $('.word2').hide();

            if(result.transferDetails.status.toString() == "PENDING"){
              swal({
                type: 'error',
                title: 'Oops...',
                text: 'The requested product is already in a tranfer process!'
              });

              return error = 1;
            }
            else if(result.currentOwner.stakeholderId == userId){
              swal({
                type: 'error',
                title: 'Oops...',
                text: 'The invoked product is owned by you already!'
              });

              return error = 1;
            }
            else{             

              let trans = {
                $class: "org.ucsc.agriblockchain.TransferDetails",
                "status": "PENDING",
                "comment": "",
                "invokedBy": "resource:org.ucsc.agriblockchain.Stakeholder#" + userId
              }

              this.asset.currentOwner = "resource:org.ucsc.agriblockchain.Stakeholder#" + result.currentOwner.stakeholderId;
              this.asset.issuer = "resource:org.ucsc.agriblockchain.Stakeholder#" + result.issuer.stakeholderId;
              
              this.asset.transferDetails = trans;
            }           
          }

          if(error == 0){
            return this.serviceProduct.updateAsset(id, this.asset)
            .toPromise()
            .then(()=>{
              return error;
            })
          }
        })   
        .then((err) => {
          this.errorMessage = null;
          this.loadOwnedProducts();
          this.loadPendingRequests();

          if(err != 1){
            swal(
              'Success!',
              'Product updated successfully!',
              'success'
            )
          }

          if(type == 1){
            $('#loader1').hide();
            $('.word1').show();
          }
          else if(type == 0){
            $('#loader0').hide();
            $('.word0').show();
          }
          else if(type == 2){
            $('#loader2').hide();
            $('.word2').show();
            $('#invokeAssetModal .close').trigger('click');
          }
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
    })    
    
  }

  getTransferDetails(id) {
    if(this.allProductIds.includes(id)){
      this.getFormForView(id);
      $("#setModal").trigger('click');
    }
    else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Product ID is not available!'
      })
    }    
  }

}
