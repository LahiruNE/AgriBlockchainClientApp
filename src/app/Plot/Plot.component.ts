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
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';
import { FarmService } from '../Farm/Farm.service';
import { InspectionService } from '../services/inspection.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ActivityService } from '../Activity/Activity.service';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { Product } from '../org.ucsc.agriblockchain';

@Component({
  selector: 'app-plot',
  templateUrl: './Plot.component.html',
  styleUrls: ['./Plot.component.css'],
  providers: [PlotService,FarmService,InspectionService,ActivityService, DataService]
})
export class PlotComponent implements OnInit {

  colorTheme = 'theme-dark-blue';
  bsConfig = Object.assign({}, { containerClass: this.colorTheme },{dateInputFormat: 'YYYY-MM-DD'});

  myForm: FormGroup;
  commentForm:FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;
  private activity;
  private ph;
  private plotinfo;
  private availFarms = [];
  private certiicationComment = [];
  private toggleLoad;
  private comm;
  private plotcomments;
  private actitype;
  private onlyacti;
  private seededArr = {};
  private harvestedArr = {};
  private growCountArr = [];
  private withFruitCountArr = [];
  private destroyedCountArr = [];

  private userType = this.localStorageService.getFromLocal('currentUser').type;

  plotId = new FormControl('', Validators.required);
  cultivationStartDate = new FormControl('', Validators.required);
  extent = new FormControl('', Validators.required);
  closerplots = new FormControl('', Validators.required);
  activities = new FormControl('', Validators.required);
  phReadings = new FormControl('', Validators.required);
  certificationBodyComments = new FormControl('', Validators.required);
  farm = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  seededDate = new FormControl('');
  cultivatedType = new FormControl('');
  seededAmount = new FormControl('');
  certificationactivity = new FormControl('');
  seed = new FormControl('');
  growthProgress = new FormControl('');

  closerPlotsN = new FormControl('');
  closerPlotsS = new FormControl('');
  closerPlotsE = new FormControl('');
  closerPlotsW = new FormControl('');

  inspectiondate = new FormControl('');
  cercomments = new FormControl('');
  commenttime = new FormControl('');
  private growCountData = [];
  private growCountLabels = [];
  private withFruitCountData = [];
  private withFruitCountLabels = [];
  private destroyedCountData = [];
  private destroyedCountLabels = [];
  
  public chartOptions:any = {responsive: true};
  public chartLegend:boolean = true;
  public chartType:string = 'line';

  public growCountChartData:Array<any> = [
    {data: this.growCountData, label: 'Sprouted Plant Count'},
  ];
  public growCountChartLabels:Array<any> = this.growCountLabels;
  public growCountChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
  ];

  public withFruitCountChartData:Array<any> = [
    {data: this.withFruitCountData, label: 'With Fruit Plant Count'},
  ];
  public withFruitCountChartLabels:Array<any> = this.withFruitCountLabels;
  public withFruitCountChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
  ];

  public destroyedCountChartData:Array<any> = [
    {data: this.destroyedCountData, label: 'Destroyed Plant Count'},
  ];
  public destroyedCountChartLabels:Array<any> = this.destroyedCountData;
  public destroyedCountChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
  ];
  
  constructor(public serviceData: DataService<Product>,private localStorageService: LocalStorageService, public servicePlot: PlotService, fb: FormBuilder, public serviceFarm: FarmService,public serviceInspection : InspectionService,public serviceActivity: ActivityService){
    this.myForm = fb.group({
      plotId: this.plotId,
      cultivationStartDate: this.cultivationStartDate,
      extent: this.extent,
      closerplots: this.closerplots,
      activities: this.activities,
      phReadings: this.phReadings,
      certificationBodyComments: this.certificationBodyComments,
      farm: this.farm, 
      status: this.status,
      closerPlotsN : this.closerPlotsN,
      closerPlotsS : this.closerPlotsS,
      closerPlotsE : this.closerPlotsE,
      closerPlotsW : this.closerPlotsW,
      seededDate : this.seededDate,
      cultivatedType : this.cultivatedType,
      seededAmount : this.seededAmount,
      certificationactivity : this.certificationactivity,
      seed : this.seed,
      growthProgress : this.growthProgress,
    });

    this.commentForm = fb.group({
      plotId: this.plotId,
      inspectiondate : this.inspectiondate,
      commenttime : this.commenttime,
      cercomments : this.cercomments
    }); 
  };

  ngOnInit(): void {
    this.loadAll();
    this.loadFarms();

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

  getPlotdata(plotid): Promise<any>{
    const plotsdata = [];
    return this.servicePlot.getAsset(plotid)
    .toPromise()
    .then((result) => {
      this.activity = result.activities ;
      this.ph = result.phReadings;
      this.plotinfo = result;
      this.plotcomments = result.certificationactivity;
      console.log(this.plotinfo)
      console.log(this.activity )
      console.log(this.ph)
    })
    
  }
  getpro(id){
    const activi =[];
    return this.serviceActivity.getTransaction(id)
    .toPromise()
    .then((result) => {
     this.actitype = result.activitytype;
     if(result.hasOwnProperty('pesticide')){
      activi.push({data:result,type:'pesticide'});
     }
     if(result.hasOwnProperty('fertilizer')){
      activi.push({data:result,type:'fertilizer'});
     }
      
      
      this.onlyacti = activi;
      console.log( this.onlyacti);
    })
    
  }
  cls(){
    $('.history').show();
    document.getElementById('historyview').scrollIntoView(true);
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
    $('.loader').show();
    $('.word').hide();

    let plots = {
      $class: "org.ucsc.agriblockchain.Directions",
      "North": this.closerPlotsN.value,
      "East": this.closerPlotsE.value,
      "South": this.closerPlotsS.value,
      "West": this.closerPlotsW.value,
    }

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Plot',
      'plotId': this.plotId.value,
      'cultivationStartDate': this.cultivationStartDate.value,
      'extent': this.extent.value,
      'closerplots' : plots,
      'activities': [],
      'phReadings': [],
      'certificationBodyComments': [],
      'status': 'NEW',
      'farm': "resource:org.ucsc.agriblockchain.Farm#" + this.farm.value,      
    };

    return  this.toggleLoad = this.servicePlot.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      
      this.loadAll();

      $('#addAssetModal .close').trigger('click');
      swal(
        'Success!',
        'Plot is added successfully!',
        'success'
      )
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

  addComment(form: any){
    $('.loader').show();
    $('.word').hide();
    let date = new Date(this.inspectiondate.value);
    let time = new Date(this.commenttime.value);
    let d = date.getFullYear().toString() +"-"+ ("0" + (date.getMonth()+1).toString()).slice(-2) +"-"+ ("0" + date.getDate().toString()).slice(-2);
    let t = ("0" + time.getHours().toString()).slice(-2) + ":" + ("0" + time.getMinutes().toString()).slice(-2);

    this.comm = {
      $class: "org.ucsc.agriblockchain.Inspection",
      'date': this.inspectiondate.value,
      'comment': this.cercomments.value,
      'time':d + "T" + t + ":00.000Z",
      'plot': "resource:org.ucsc.agriblockchain.Plot#"+form.get('plotId').value
    };
    console.log(this.comm);
    this.serviceInspection.addTransaction(this.comm)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
      $('#addcomment .close').trigger('click');
      swal(
        'Success!',
        'Comment is added successfully!',
        'success'
      )
      $('.loader').hide();
      $('.word').show();

      
      
    })
  } 


  updateAsset(form: any): Promise<any> {
    $('.loader').show();
    $('.word').hide();

    let plots = {
      $class: "org.ucsc.agriblockchain.Directions",
      "North": this.closerPlotsN.value,
      "East": this.closerPlotsE.value,
      "South": this.closerPlotsS.value,
      "West": this.closerPlotsW.value,
    }

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Plot',
      'cultivationStartDate': this.cultivationStartDate.value,
      'extent': this.extent.value,
      'seededDate': this.seededDate.value,
      'seededAmount': this.seededAmount.value,
      'seed': this.seed.value,
      'certificationactivity': this.certificationactivity.value,
      'cultivatedType': this.cultivatedType.value,
      'growthProgress': this.growthProgress.value,
      'closerplots' : plots,
      'activities': this.activities.value,
      'phReadings': this.phReadings.value,
      'certificationBodyComments': this.certificationBodyComments.value,
      'status' : this.status.value,
      'farm': "resource:org.ucsc.agriblockchain.Farm#" + this.farm.value,
    };
    
    return this.toggleLoad = this.servicePlot.updateAsset(form.get('plotId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();

      $('#updateAssetModal .close').trigger('click');
      swal(
        'Success!',
        'Plot is updated successfully!',
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
    $('#update1').trigger('click');

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
        'farm': null,
        'status': null,
        'closerPlotsN' : null,
        'closerPlotsS' : null,
        'closerPlotsE' : null,
        'closerPlotsW' : null,
        'seededDate' : null,
        'cultivatedType' : null,
        'seededAmount' : null, 
        'certificationactivity' : null,
        'seed' : null,
        'growthProgress' : null,
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

      if (result.seededDate) {
        formObject.seededDate = result.seededDate.toString().split('T')[0];
      } else {
        formObject.seededDate = null;      
      }

      if (result.cultivatedType) {
        formObject.cultivatedType = result.cultivatedType;
      } else {
        formObject.cultivatedType = null;          
      }

      if (result.seededAmount) {
        formObject.seededAmount = result.seededAmount;
      } else {
        formObject.seededAmount = null;      
      }

      if (result.extent) {
        formObject.extent = result.extent;
      } else {
        formObject.extent = null;
      }

      if (result.closerplots) {
        formObject.closerplots = result.closerplots;
        formObject.closerPlotsN = result.closerplots.North;
        formObject.closerPlotsE = result.closerplots.East;
        formObject.closerPlotsS = result.closerplots.South;
        formObject.closerPlotsW = result.closerplots.West;

      } else {
        formObject.closerplots = null;
        formObject.closerPlotsN = null;
        formObject.closerPlotsE = null;
        formObject.closerPlotsS = null;
        formObject.closerPlotsW = null;
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
        formObject.farm = result.farm.farmId;
      } else {
        formObject.farm = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.certificationactivity) {
        formObject.certificationactivity = result.certificationactivity;
      } else {
        formObject.certificationactivity = null;
      }

      if (result.seed) {
        formObject.seed = result.seed;
      } else {
        formObject.seed = null;
      }

      if (result.growthProgress) {
        formObject.growthProgress = result.growthProgress;
      } else {
        formObject.growthProgress = null;
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

    this.getHarvestDetails(id);

    $('#view1').trigger('click');

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
        'farm': null,
        'status':null,
        'closerPlotsN' : null,
        'closerPlotsS' : null,
        'closerPlotsE' : null,
        'closerPlotsW' : null,
        'seededDate' : null,
        'cultivatedType' : null,
        'seededAmount' : null,
        'certificationactivity' : null,
        'seed' : null,
        'growthProgress' : null,
      };

      if (result.plotId) {
        formObject.plotId = result.plotId;
      } else {
        formObject.plotId = null;
      }

      if (result.cultivationStartDate) {
        formObject.cultivationStartDate = result.cultivationStartDate.toString().split('T')[0];
      } else {
        formObject.cultivationStartDate = null;
      }

      if (result.seededDate) {
        formObject.seededDate = result.seededDate.toString().split('T')[0];
        this.seededArr['date'] = result.seededDate.toString().split('T')[0];
      } else {
        formObject.seededDate = null;      
      }

      if (result.cultivatedType) {
        formObject.cultivatedType = result.cultivatedType;
        this.seededArr['type'] = result.cultivatedType; 
      } else {
        formObject.cultivatedType = null;          
      }

      if (result.seededAmount) {
        formObject.seededAmount = result.seededAmount;
        this.seededArr['qty'] = result.seededAmount;
      } else {
        formObject.seededAmount = null;      
      }

      if (result.extent) {
        formObject.extent = result.extent;
      } else {
        formObject.extent = null;
      }

      if (result.closerplots) {
        formObject.closerplots = result.closerplots;
        formObject.closerPlotsN = result.closerplots.North;
        formObject.closerPlotsE = result.closerplots.East;
        formObject.closerPlotsS = result.closerplots.South;
        formObject.closerPlotsW = result.closerplots.West;

      } else {
        formObject.closerplots = null;
        formObject.closerPlotsN = null;
        formObject.closerPlotsE = null;
        formObject.closerPlotsS = null;
        formObject.closerPlotsW = null;
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

        this.certiicationComment = result.certificationBodyComments;
      } else {
        formObject.certificationBodyComments = null;
      }

      if (result.farm) {
        formObject.farm = result.farm.farmId;
      } else {
        formObject.farm = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.growthProgress) {
        this.growCountArr = result.growthProgress.growCount;
        this.withFruitCountArr = result.growthProgress.fruitCount;
        this.destroyedCountArr = result.growthProgress.destroyedCount;

        this.growCountArr.forEach(grow=>{
          let date = grow.addedDate.split("T")[0];
          let time = grow.addedDate.split("T")[1].split(":")[0] + ":" + grow.addedDate.split("T")[1].split(":")[1];
          
          if(this.growCountData.indexOf(grow.count) == -1 || (this.growCountData.indexOf(grow.count) != -1 && this.growCountData.length < this.growCountArr.length)){
            this.growCountData.push(grow.count);
          }
          
          if(this.growCountLabels.indexOf(grow.date) == -1 || (this.growCountLabels.indexOf(grow.date) != -1 && this.growCountLabels.length < this.growCountArr.length)){
            this.growCountLabels.push(grow.date);
          }
          
        });

        this.withFruitCountArr.forEach(grow=>{
          let date = grow.addedDate.split("T")[0];
          let time = grow.addedDate.split("T")[1].split(":")[0] + ":" + grow.addedDate.split("T")[1].split(":")[1];
        
          if(this.withFruitCountData.indexOf(grow.count) == -1 || (this.withFruitCountData.indexOf(grow.count) != -1 && this.withFruitCountData.length < this.withFruitCountArr.length)){
            this.withFruitCountData.push(grow.count);
          }
          
          if(this.withFruitCountLabels.indexOf(grow.date) == -1 || (this.withFruitCountLabels.indexOf(grow.date) != -1 && this.withFruitCountLabels.length < this.withFruitCountArr.length)){
            this.withFruitCountLabels.push(grow.date);
          }
        });

        this.destroyedCountArr.forEach(grow=>{
          let date = grow.addedDate.split("T")[0];
          let time = grow.addedDate.split("T")[1].split(":")[0] + ":" + grow.addedDate.split("T")[1].split(":")[1];
          
          if(this.destroyedCountData.indexOf(grow.count) == -1 || (this.destroyedCountData.indexOf(grow.count) != -1 && this.destroyedCountData.length < this.destroyedCountArr.length)){
            this.destroyedCountData.push(grow.count);
          }
          
          if(this.destroyedCountLabels.indexOf(grow.date) == -1 || (this.destroyedCountLabels.indexOf(grow.date) != -1 && this.destroyedCountLabels.length < this.destroyedCountArr.length)){
            this.destroyedCountLabels.push(grow.date);
          }          
        });
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

  getFormForComment(id: any){
    console.log(id);
    return this.servicePlot.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'plotId': null,
        'inspectiondate':null,
        'cercomments':null,
        'commenttime':null
        
        
      };
  
      if (result.plotId) {
        formObject.plotId = result.plotId;
      } else {
        formObject.plotId = null;
      }
     
      this.commentForm.setValue(formObject); 
  
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
      'plotId': null,
      'cultivationStartDate': null,
      'extent': null,
      'closerplots': null,
      'activities': null,
      'phReadings': null,
      'certificationBodyComments': null,
      'farm': null,
      'status':null,
      'closerPlotsN' : null,
      'closerPlotsS' : null,
      'closerPlotsE' : null,
      'closerPlotsW' : null,
      'seededDate' : null,
      'cultivatedType' : null,
      'seededAmount' : null                        
    });
  }

  loadFarms(): Promise<any>{
    const tempList = [];
    return this.serviceFarm.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        this.availFarms.push(asset);
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

  getHarvestDetails(plotId){
    let plot = "resource%3Aorg.ucsc.agriblockchain.Plot%23" + plotId;
    
    return this.serviceData.getHavestDetails(plot)
    .toPromise()
    .then((result) => {
      this.harvestedArr['date'] = result[0].pluckedDate.toString().split('T')[0];;
      this.harvestedArr['qty'] = result[0].quantity;
      this.harvestedArr['type'] = result[0].productType;
      this.harvestedArr['unit'] = result[0].unit;
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

}
