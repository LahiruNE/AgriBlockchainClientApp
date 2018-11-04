import { Component, OnInit } from '@angular/core';
import { PlotService } from '../Plot/Plot.service';
import { Plot } from '../org.ucsc.agriblockchain';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';
import swal from 'sweetalert2';

@Component({
  selector: 'app-plant-growth',
  templateUrl: './plant-growth.component.html',
  styleUrls: ['./plant-growth.component.css'],
  providers: [PlotService]
})

export class PlantGrowthComponent implements OnInit {
  myForm: FormGroup;
  plantCountForm: FormGroup;
  growthCountFormArr: FormArray;
  withFruitCountFormArr: FormArray;
  destroyedCountFormArr: FormArray;

  private errorMessage;
  private seededPlots = {};
  private farms = [];
  private certificationComment = [];
  private toggleLoad;
  private asset;
  private growCountArr = [];
  private withFruitCountArr = [];
  private destroyedCountArr = [];
  private growthCountNo;
  private withFruitCountNo;
  private destroyedCountNo;

  plotId = new FormControl('', Validators.required);
  cultivationStartDate = new FormControl('', Validators.required);
  extent = new FormControl('', Validators.required);
  closerplots = new FormControl('', Validators.required);
  activities = new FormControl('', Validators.required);
  phReadings = new FormControl('', Validators.required);
  certificationBodyComments = new FormControl('', Validators.required);
  farm = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  amount = new FormControl('');
  seededDate = new FormControl('');
  cultivatedType = new FormControl('');
  closerPlotsN = new FormControl('');
  closerPlotsS = new FormControl('');
  closerPlotsE = new FormControl('');
  closerPlotsW = new FormControl('');
  wateringDate = new FormControl('');
  wateringTime = new FormControl('');

  constructor(private localStorageService: LocalStorageService, public servicePlot: PlotService, private fb: FormBuilder) {
    this.myForm = fb.group({
      plotId: this.plotId,
      cultivationStartDate: this.cultivationStartDate,
      seededDate: this.seededDate,
      extent: this.extent,
      closerplots: this.closerplots,
      activities: this.activities,
      phReadings: this.phReadings,
      certificationBodyComments: this.certificationBodyComments,
      farm: this.farm, 
      status: this.status,
      amount: this.amount,
      cultivatedType: this.cultivatedType,
      closerPlotsN : this.closerPlotsN,
      closerPlotsS : this.closerPlotsS,
      closerPlotsE : this.closerPlotsE,
      closerPlotsW : this.closerPlotsW,
      wateringDate : this.wateringDate,
      wateringTime : this.wateringTime,
    });

    this.plantCountForm = fb.group({
      growthCountFormArr: fb.array([]),
      withFruitCountFormArr: fb.array([]),
      destroyedCountFormArr: fb.array([]),
    });
  };

  ngOnInit() {
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

  loadPlots() {
    this.seededPlots = {};
    this.farms = [];
    
    return this.servicePlot.getAll()
    .toPromise()
    .then((plot) => {
      this.errorMessage = null;
      plot.forEach(asset => {
        if(this.farms.indexOf(asset.farm.farmId) == -1){
          this.farms.push(asset.farm.farmId);
        }

        if(asset.status.toString() == "SEEDED"){
          if(this.seededPlots.hasOwnProperty(asset.farm.farmId)){
            this.seededPlots[asset.farm.farmId].push(asset);
          }
          else{
            this.seededPlots[asset.farm.farmId] = [asset];
          }
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

  getFormForView(plot: Plot, type) {
    if(type == 'view'){
      $('#view1').click();
    }
    else{
      $('#progress1').click();
      this.plantCountForm.setControl('growthCountFormArr', this.fb.array([]));
    }

    const formObject = {
      'plotId': null,
      'cultivationStartDate': null,
      'seededDate': null,
      'extent': null,
      'closerplots': null,
      'activities': null,
      'phReadings': null,
      'certificationBodyComments': null,
      'farm': null,
      'status': null,
      'amount': null,
      'cultivatedType':null,
      'closerPlotsN' : null,
      'closerPlotsS' : null,
      'closerPlotsE' : null,
      'closerPlotsW' : null, 
      'wateringDate' : null,
      'wateringTime' : null
    };

    const countFormObject = {
      'growthCountFormArr' : null,
      'withFruitCountFormArr' : null,
      'destroyedCountFormArr' : null,
    }

    if (plot.plotId) {
      formObject.plotId = plot.plotId;
    } else {
      formObject.plotId = null;
    }

    if (plot.cultivationStartDate) {
      formObject.cultivationStartDate = plot.cultivationStartDate.toString().split('T')[0];
    } else {
      formObject.cultivationStartDate = null;
    }

    if (plot.seededDate) {
      formObject.seededDate = plot.seededDate.toString().split('T')[0];
    } else {
      formObject.seededDate = null;
    }

    if (plot.extent) {
      formObject.extent = plot.extent;
    } else {
      formObject.extent = null;
    }

    if (plot.closerplots) {
      formObject.closerplots = plot.closerplots;
      formObject.closerPlotsN = plot.closerplots.North;
      formObject.closerPlotsE = plot.closerplots.East;
      formObject.closerPlotsS = plot.closerplots.South;
      formObject.closerPlotsW = plot.closerplots.West;

    } else {
      formObject.closerplots = null;
      formObject.closerPlotsN = null;
      formObject.closerPlotsE = null;
      formObject.closerPlotsS = null;
      formObject.closerPlotsW = null;
    }

    if (plot.activities) {
      formObject.activities = plot.activities;
    } else {
      formObject.activities = null;
    }

    if (plot.phReadings) {
      formObject.phReadings = plot.phReadings;
    } else {
      formObject.phReadings = null;
    }

    if (plot.certificationBodyComments) {
      formObject.certificationBodyComments = plot.certificationBodyComments;

      this.certificationComment = plot.certificationBodyComments;
    } else {
      formObject.certificationBodyComments = null;
    }

    if (plot.farm) {
      formObject.farm = plot.farm.farmId;
    } else {
      formObject.farm = null;
    }

    if (plot.status) {
      formObject.status = plot.status;
    } else {
      formObject.status = null;
    }

    if (plot.cultivatedType) {
      formObject.cultivatedType = plot.cultivatedType;
    } else {
      formObject.cultivatedType = null;
    }
    
    if(plot.growthProgress) {
      this.growthCountNo = plot.growthProgress.growCount.length;
      this.withFruitCountNo = plot.growthProgress.fruitCount.length;
      this.destroyedCountNo = plot.growthProgress.destroyedCount.length;

      this.plantCountForm.setControl('growthCountFormArr', this.fb.array([]));
      this.plantCountForm.setControl('withFruitCountFormArr', this.fb.array([]));
      this.plantCountForm.setControl('destroyedCountFormArr', this.fb.array([]));

      countFormObject.growthCountFormArr = this.plantCountForm.get('growthCountFormArr') as FormArray;
      countFormObject.withFruitCountFormArr = this.plantCountForm.get('withFruitCountFormArr') as FormArray;
      countFormObject.destroyedCountFormArr = this.plantCountForm.get('destroyedCountFormArr') as FormArray; 

      this.growCountArr = plot.growthProgress.growCount;
      this.withFruitCountArr = plot.growthProgress.fruitCount;
      this.destroyedCountArr = plot.growthProgress.destroyedCount;

      this.growCountArr.forEach(grow=>{
        let date = grow.addedDate.split("T")[0];
        let time = grow.addedDate.split("T")[1].split(":")[0] + ":" + grow.addedDate.split("T")[1].split(":")[1];

        countFormObject.growthCountFormArr.push(
          this.fb.group({
            date:grow.date,
            timeStamp:date + " " + time,
            qty: grow.count,
            comment: grow.comment
          })
        ); 
      });

      this.withFruitCountArr.forEach(grow=>{
        let date = grow.addedDate.split("T")[0];
        let time = grow.addedDate.split("T")[1].split(":")[0] + ":" + grow.addedDate.split("T")[1].split(":")[1];

        countFormObject.withFruitCountFormArr.push(
          this.fb.group({
            date:grow.date,
            timeStamp:date + " " + time,
            qty: grow.count,
            comment: grow.comment
          })
        ); 
      });

      this.destroyedCountArr.forEach(grow=>{
        let date = grow.addedDate.split("T")[0];
        let time = grow.addedDate.split("T")[1].split(":")[0] + ":" + grow.addedDate.split("T")[1].split(":")[1];

        countFormObject.destroyedCountFormArr.push(
          this.fb.group({
            date:grow.date,
            timeStamp:date + " " + time,
            qty: grow.count,
            comment: grow.comment
          })
        ); 
      });

    } else {

    }

    this.myForm.setValue(formObject);
    this.plantCountForm.setValue(countFormObject);

  }

  addField(type){
    if(type == 0){
      this.growthCountFormArr = this.plantCountForm.get('growthCountFormArr') as FormArray;
      this.growthCountFormArr.push(this.addQty()); 
    }
    else if(type == 1){
      this.withFruitCountFormArr = this.plantCountForm.get('withFruitCountFormArr') as FormArray;
      this.withFruitCountFormArr.push(this.addQty()); 
    }
    else{
      this.destroyedCountFormArr = this.plantCountForm.get('destroyedCountFormArr') as FormArray;
      this.destroyedCountFormArr.push(this.addQty()); 
    }
  }

  addQty() : FormGroup{
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth()+1).toString().length == 1 ? "0"+(date.getMonth()+1) : (date.getMonth()+1); 
    let day = date.getDate().toString().length == 1 ? "0"+ date.getDate() : date.getDate();
    let hour = date.getHours().toString().length == 1 ? "0"+ date.getHours() : date.getHours();
    let minute = date.getMinutes().toString().length == 1 ? "0"+ date.getMinutes() : date.getMinutes();

    let dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
    
    return this.fb.group({
      date:'',
      timeStamp:dateTime,
      qty: '',
      comment: ''
    });
  }

  removeField(index, type){
    if(type == 0){
      let fArray = <FormArray>this.plantCountForm.controls['growthCountFormArr'];
      fArray.removeAt(index);
    }
    else if(type == 1){
      let fArray = <FormArray>this.plantCountForm.controls['withFruitCountFormArr'];
      fArray.removeAt(index);
    }
    else{
      let fArray = <FormArray>this.plantCountForm.controls['destroyedCountFormArr'];
      fArray.removeAt(index);
    }
  }

  updateAsset(type){
    $('.loader').show();
    $('.word').hide();

    let growthCountArr = this.plantCountForm.value['growthCountFormArr'];
    let withFruitCountArr = this.plantCountForm.value['withFruitCountFormArr'];
    let destroyedCountArr = this.plantCountForm.value['destroyedCountFormArr'];
    let growCount = [];
    let fruitCount = [];
    let destroyedCount = [];

    growthCountArr.forEach((progress)=>{
      let date = new Date(progress.timeStamp);
      
      let d = date.getFullYear().toString() +"-"+ ("0" + (date.getMonth()+1).toString()).slice(-2) +"-"+ ("0" + date.getDate().toString()).slice(-2);
      let t = ("0" + date.getHours().toString()).slice(-2) + ":" + ("0" + date.getMinutes().toString()).slice(-2);
      
      let item = {      
        $class: "org.ucsc.agriblockchain.GrowthRecord",
        'date': progress.date,
        'addedDate': d + "T" + t + ":00.000Z",
        'count': progress.qty,
        'comment': progress.comment     
      }
    growCount.push(item);

    });     
    
    withFruitCountArr.forEach((progress)=>{
      let date = new Date(progress.timeStamp);
      
      let d = date.getFullYear().toString() +"-"+ ("0" + (date.getMonth()+1).toString()).slice(-2) +"-"+ ("0" + date.getDate().toString()).slice(-2);
      let t = ("0" + date.getHours().toString()).slice(-2) + ":" + ("0" + date.getMinutes().toString()).slice(-2);
      
      let item = {      
        $class: "org.ucsc.agriblockchain.GrowthRecord",
        'date': progress.date,
        'addedDate': d + "T" + t + ":00.000Z",
        'count': progress.qty,
        'comment': progress.comment     
      }
    fruitCount.push(item);

    });

    destroyedCountArr.forEach((progress)=>{
      let date = new Date(progress.timeStamp);
      
      let d = date.getFullYear().toString() +"-"+ ("0" + (date.getMonth()+1).toString()).slice(-2) +"-"+ ("0" + date.getDate().toString()).slice(-2);
      let t = ("0" + date.getHours().toString()).slice(-2) + ":" + ("0" + date.getMinutes().toString()).slice(-2);
      
      let item = {      
        $class: "org.ucsc.agriblockchain.GrowthRecord",
        'date': progress.date,
        'addedDate': d + "T" + t + ":00.000Z",
        'count': progress.qty,
        'comment': progress.comment     
      }
    destroyedCount.push(item);

    });

    let growthProgress = {
      $class: "org.ucsc.agriblockchain.GrowthProgress",
      'growCount': growCount,
      'fruitCount': fruitCount,
      'destroyedCount': destroyedCount
    };

    let plots = {
      $class: "org.ucsc.agriblockchain.Directions",
      "North": this.closerPlotsN.value,
      "East": this.closerPlotsE.value,
      "South": this.closerPlotsS.value,
      "West": this.closerPlotsW.value,
    };

    this.asset = {
      $class: 'org.ucsc.agriblockchain.Plot',
      'cultivationStartDate': this.cultivationStartDate.value,
      'seededDate': this.seededDate.value,
      'extent': this.extent.value,
      'closerplots' : plots,
      'activities': this.activities.value,
      'phReadings': this.phReadings.value,
      'certificationBodyComments': this.certificationBodyComments.value,
      'status' : this.status.value,
      'cultivatedType' : this.cultivatedType.value,
      'farm': "resource:org.ucsc.agriblockchain.Farm#" + this.farm.value,
      'growthProgress': growthProgress
    };
    
    return this.toggleLoad = this.servicePlot.updateAsset(this.myForm.get('plotId').value, this.asset)
    .toPromise()
    .then(()=>{
      this.errorMessage = null;
      this.loadPlots();

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

  setDisabled(index, type) {
    if(type == 0 && index < this.growthCountNo) {
      return true;
    }
    if(type == 1 && index < this.withFruitCountNo) {
      return true;
    }
    if(type == 2 && index < this.destroyedCountNo) {
      return true;
    }
    else {
      return false;
    }
  }

}
