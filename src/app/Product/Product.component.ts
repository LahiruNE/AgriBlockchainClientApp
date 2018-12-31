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
import { ProductService } from './Product.service';
import 'rxjs/add/operator/toPromise';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import $ from 'jquery';
import { StakeholderService } from '../Stakeholder/Stakeholder.service';
import { FileHolder } from 'angular2-image-upload';
import swal from 'sweetalert2';
import { PlotService } from '../Plot/Plot.service';
import { DataService } from '../data.service';
import { Product } from '../org.ucsc.agriblockchain';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.css'],
  providers: [ProductService, StakeholderService, PlotService, DataService]
})
export class ProductComponent implements OnInit {

  colorTheme = 'theme-dark-blue';
  bsConfig = Object.assign({}, { containerClass: this.colorTheme },{dateInputFormat: 'YYYY-MM-DD'});

  myForm: FormGroup;
  viewForm: FormGroup;
  divideForm: FormGroup;
  wasteForm:FormGroup;
  certImagesFormArr: FormArray;
  productsFormArr: FormArray;

  elementType : 'url' | 'canvas' | 'img' = 'url';
  value : string;
  downHref = "#";

  private userType = this.localStorageService.getFromLocal('currentUser').type;

  private allAssets;
  private productspath; 
  private stakename; 
  private asset;
  private preqty;
  private pretype;
  private newQty;
  private currentId;
  private errorMessage;
  private certificationImages = [];
  private availParticipants = [];
  private newquantyties;
  private availCertification = [];
  private availPlots = [];
  private uploadCertImages = [];
  private toggleLoad;
  private certiicationComment = [];
  private productTypes = ['CARROT', 'TOMATO', 'PINEAPPLE']; 
  private units = ['KG', 'G', 'MT', 'L', 'ML', 'ITEM'];
  private productsArr = [];
  private divideViewQty;  
  private stat;
  private currentowner;

  private seededArr = {};
  private harvestedArr = {};

  private growCountArr = [];
  private withFruitCountArr = [];
  private destroyedCountArr = [];

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
  products = new FormControl('');
  divideProduct = new FormControl('');

  wastequantity = new FormControl('');
  lostquantity = new FormControl('');
  wastecomment = new FormControl('');

  parentProduct;
  divideStatus;
  activeStatus;
  productpath;

  constructor(private localStorageService : LocalStorageService, public serviceData: DataService<Product>, public servicePlot: PlotService, public serviceProduct: ProductService, private fb: FormBuilder, public serviceStakeholder : StakeholderService) {
    this.myForm = fb.group({
      productId: this.productId,
      pluckedDate: this.pluckedDate,
      certification: this.certification,
      productType: this.productType,
      quantity: this.quantity,
      wastequantity:this.wastequantity,
      lostquantity:this.lostquantity,
      wastecomment: this.wastecomment,
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
      wastequantity:this.wastequantity,
      lostquantity:this.lostquantity,
      wastecomment: this.wastecomment,
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

    this.divideForm = fb.group({
      divideProduct: this.divideProduct,
      productsFormArr: fb.array([])
    });

    this.wasteForm = fb.group({
      productId: this.productId,
      pluckedDate: this.pluckedDate,
      certification: this.certification,
      productType: this.productType,
      quantity: this.quantity,
      wastequantity:this.wastequantity,
      lostquantity:this.lostquantity,
      wastecomment: this.wastecomment,
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
    })
  };

  ngOnInit(): void {
    if(this.userType == "ADMIN"){
      this.loadAll();
    }
    else{
      this.loadOwnedProducts();
    }    
    
    this.loadParticipants();
    this.loadPlots();

    $('.history').hide();    

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
  
  cls(){
    $('.history').show();
    document.getElementById('historyview').scrollIntoView(true);
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

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceProduct.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        if(asset.activeStatus.toString() != "CLOSED"){
          tempList.push(asset);
        }
        
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

  getProductdata(productid): Promise<any>{ 
    
    const path =[];
    return this.serviceProduct.getAsset(productid) 
    .toPromise() 
    .then((result) => { 
      this.productspath = result.productpath;
      this.pretype = result.productType;
      this.currentowner = result.currentOwner;
      
     /*    for(var i = 0;i < this.preqty.length; i++ ){
          if([i+1] == this.preqty.length){
            
            if(this.preqty[i].quantity == this.preqty[i-1].quantity){
              path.push({path:this.preqty[i],ty:this.pretype,stat:false});
            }
            else{
              path.push({path:this.preqty[i],ty:this.pretype,stat:true});
            }
          }
          else if(this.preqty[i].quantity == this.preqty[i+1].quantity ){
            path.push({path:this.preqty[i],ty:this.pretype,stat:false});
 
          }
          else{
            path.push({path:this.preqty[i],ty:this.pretype,stat:true});
          }

        } */

       
      console.log(this.productspath) 
      console.log(result) 
    }) 
     
  } 
  
  getFormForWaste(id: any){
    console.log(id);
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
        'wastequantity':null,
        'lostquantity':null,
        'wastecomment':null,
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

      if (result.wastequantity) {
        formObject.wastequantity = result.wastequantity;
      } else {
        formObject.wastequantity = null;
      }
      if (result.lostquantity) {
        formObject.lostquantity = result.lostquantity;
      } else {
        formObject.lostquantity = null;
      }

      if (result.wastecomment) {
        formObject.wastecomment = result.wastecomment;
      } else {
        formObject.wastecomment = null;
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

      this.wasteForm.setValue(formObject); 
  
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
    $('.loader').show();
    $('.word').hide();
    
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
      'productId': this.productId.value,
      'pluckedDate': this.pluckedDate.value,
      'certification': certi,
      'productType': this.productType.value,
      'quantity': this.quantity.value,
      'wastequantity':this.wastequantity.value,
      'lostquantity':this.lostquantity.value,
      'wastecomment':this.wastecomment.value,
      'unit': this.unit.value,
      'divideStatus': 'ORIGINAL',
      'activeStatus': 'ACTIVE',
      'plot': "resource:org.ucsc.agriblockchain.Plot#" + this.plot.value,
      'currentOwner': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.currentOwner.value,
      'issuer': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.currentOwner.value,
    }; 

    return this.toggleLoad = this.serviceProduct.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;   

      if(this.userType == "ADMIN"){
        this.loadAll();
      }
      else{
        this.loadOwnedProducts();
      }  

      swal(
        'Success!',
        'Product added successfully!',
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
  updateWaste(form: any){
    $('.loader').show();
    $('.word').hide();
    console.log(form.get('productpath').value)

    if(form.get('quantity').value > this.wastequantity.value){
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
      'quantity': this.quantity.value - this.wastequantity.value,
      'wastequantity':this.wastequantity.value,
      'wastecomment':this.wastecomment.value,
      'productpath':this.productpath.value,
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

   /* if(this.productpath != "") {                        
      this.asset.productpath = this.productpath;   
    }  */

    return this.toggleLoad = this.serviceProduct.updateAsset(form.get('productId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      if(this.userType == "ADMIN"){
        this.loadAll();
      }
      else{
        this.loadOwnedProducts();
      }  

      $('#updateAssetModal .close').trigger('click');
      swal(
        'Success!',
        'Waste added successfully!',
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
    else{
      swal({
        type: 'error',
        title: 'Oops...',
        text: "Can't added. Exceeding quantities!"
      });
      $('.loader').hide();
      $('.word').show();
    }
  }
  divideAsset(form: any) {
    $('.loader').show();
    $('.word').hide();

    let qty = this.divideForm.value['productsFormArr'];
    let productQty = [];

    qty.forEach((prod)=>{
      let item = prod.product;
      productQty.push(item);
    });
    
    let sum = productQty.reduce((a, b) => a + b, 0)

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
        if(sum > this.divideViewQty){
          $('.loader').hide();
          $('.word').show();

          swal({
            type: 'error',
            title: 'Oops...',
            text: "Can't divide. Exceeding quantities!"
          });
        }
        else{
          let asset = {
            "$class": "org.ucsc.agriblockchain.DivideAsset",
            "product": "resource:org.ucsc.agriblockchain.Product#" + this.divideProduct.value,
            "divideQty": productQty,
          };
          
          return this.toggleLoad = this.serviceData.divideAsset(asset)
          .toPromise()
          .then(() => {
            this.errorMessage = null;   

            if(this.userType == "ADMIN"){
              this.loadAll();
            }
            else{
              this.loadOwnedProducts();
            }  

            swal(
              'Success!',
              'Product divided successfully!',
              'success'
            )
            $('#divideAssetModal .close').trigger('click');
            $('.loader').hide();
            $('.word').show();
          })
          .catch((error) => {
            $('.loader').hide();
            $('.word').show();

            if (error === 'Server error') {
                this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
            } else {
                this.errorMessage = error;
            }
          });  

        }
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
      if(this.userType == "ADMIN"){
        this.loadAll();
      }
      else{
        this.loadOwnedProducts();
      }  

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

    return this.serviceProduct.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      if(this.userType == "ADMIN"){
        this.loadAll();
      }
      else{
        this.loadOwnedProducts();
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
        'wastequantity':null,
        'lostquantity':null,
        'wastecomment':null,
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

      if (result.wastequantity) {
        formObject.wastequantity = result.wastequantity;
      } else {
        formObject.wastequantity = null;
      }
      if (result.lostquantity) {
        formObject.lostquantity = result.lostquantity;
      } else {
        formObject.lostquantity = null;
      }
      if (result.wastecomment) {
        formObject.wastecomment = result.wastecomment;
      } else {
        formObject.wastecomment = null;
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

    this.growCountArr = [];
    this.withFruitCountArr = [];
    this.destroyedCountArr = [];
    this.harvestedArr = {};
    this.seededArr = {};

    
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
        'wastequantity':null,
        'lostquantity':null,
        'wastecomment':null,
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

        this.value = result.productId;
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
      if (result.wastequantity) {
        formObject.wastequantity = result.wastequantity;
      } else {
        formObject.wastequantity = null;
      }
      if (result.lostquantity) {
        formObject.lostquantity = result.lostquantity;
      } else {
        formObject.lostquantity = null;
      }
      if (result.wastecomment) {
        formObject.wastecomment = result.wastecomment;
      } else {
        formObject.wastecomment = null;
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

      this.seededArr['date'] = result.plot.seededDate.toString().split('T')[0];
      this.seededArr['type'] = result.plot.cultivatedType; 
      this.seededArr['qty'] = result.plot.seededAmount;
      this.getHarvestDetails(result.plot.plotId);
      console.log(result);
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

  getHarvestDetails(plotId){
    let plot = "resource%3Aorg.ucsc.agriblockchain.Plot%23" + plotId;
    
    return this.serviceData.getHavestDetails(plot)
    .toPromise()
    .then((result) => {
      this.harvestedArr['date'] = result[0].pluckedDate.toString().split('T')[0];;
      this.harvestedArr['qty'] = result[0].quantity;
      this.harvestedArr['type'] = result[0].productType;
      this.harvestedArr['unit'] = result[0].unit;
    
      
      console.log(result);
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
      'wastequantity':null,
      'lostquantity':null,
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

  resetDivideForm(): void {
    $('#divide1').trigger('click');

    this.divideForm.setControl('productsFormArr', this.fb.array([]));

    this.divideForm.setValue({
      'divideProduct': null,
      'productsFormArr': null,
      'quantity': null
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

  setHrefForDownload() {
    this.downHref = $('.aclass img').attr('src');    
  }

  addField(){
    this.productsFormArr = this.divideForm.get('productsFormArr') as FormArray;
    this.productsFormArr.push(this.addProduct());      
  }

  addProduct() : FormGroup{
    return this.fb.group({
      product: ''
    });
  }

  removeField(index){
    let fArray = <FormArray>this.divideForm.controls['productsFormArr'];
    fArray.removeAt(index);
  }

  setQty(id){
    if(id != ""){
      return this.serviceProduct.getAsset(id)
      .toPromise()
      .then((result) => {  

        if (result.quantity) {
          this.divideViewQty = result.quantity;

          $("#availQtyTr").show();
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
    else{
      $("#availQtyTr").hide();
    }

  }

}
