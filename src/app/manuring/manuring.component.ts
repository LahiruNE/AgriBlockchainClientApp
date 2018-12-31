import { Component, OnInit } from '@angular/core';
import { PlotService } from '../Plot/Plot.service';
import { Plot } from '../org.ucsc.agriblockchain';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';
import swal from 'sweetalert2';
import { ActivityService } from '../Activity/Activity.service';
import { FertilizerService } from '../Fertilizer/Fertilizer.service';
import { PesticideService } from '../Pesticide/Pesticide.service';

@Component({
  selector: 'app-manuring',
  templateUrl: './manuring.component.html',
  styleUrls: ['./manuring.component.css'],
  providers: [PlotService, ActivityService, FertilizerService, PesticideService]
})
export class ManuringComponent implements OnInit {

  colorTheme = 'theme-dark-blue';
  bsConfig = Object.assign({}, { containerClass: this.colorTheme },{dateInputFormat: 'YYYY-MM-DD'});

  myForm: FormGroup;

  private errorMessage;
  private seededPlots = {};
  private farms = [];
  private certificationComment = [];
  private toggleLoad;
  private asset;
  private availFerti = [];
  private availPest = [];
  private manureTypes = ['Pesticide', 'Fertilizer'];
  private manureType;

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
  manuringDate = new FormControl('');
  manuringTime = new FormControl('');
  fertilizer = new FormControl('');
  pesticide = new FormControl('');
  
  constructor(private localStorageService: LocalStorageService, public servicePlot: PlotService, public serviceActivity: ActivityService, public serviceFertilizer: FertilizerService, public servicePesticide: PesticideService, fb: FormBuilder) {
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
      manuringDate : this.manuringDate,
      manuringTime : this.manuringTime,
      fertilizer : this.fertilizer,
      pesticide : this.pesticide
    });
  };

  ngOnInit() {
    this.loadPlots();
    this.loadFertilizer();
    this.loadPesticide();

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

  loadFertilizer() {
    this.availFerti = [];

    return this.serviceFertilizer.getAll()
    .toPromise()
    .then((fertilizer) => {
      this.errorMessage = null;
      fertilizer.forEach(asset => {
        if(asset.amount > 0){
            this.availFerti.push(asset);
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

  loadPesticide() {
    this.availPest = [];

    return this.servicePesticide.getAll()
    .toPromise()
    .then((pesticide) => {
      this.errorMessage = null;
      pesticide.forEach(asset => {
        if(asset.amount > 0){
            this.availPest.push(asset);
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

  loadFert(id) {
    return this.serviceFertilizer.getAsset(id)
    .toPromise()
  }

  loadPest(id) {
    return this.servicePesticide.getAsset(id)
    .toPromise()
  }

  getFormForView(plot: Plot, type) {
    if(type == 'view'){
      $('#view1').click();
    }
    else{
      $('#maure1').click();
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
      'manuringDate' : null,
      'manuringTime' : null,
      'fertilizer' : null,
      'pesticide' : null
    };

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

    this.myForm.setValue(formObject);

  }

  updateAsset(form: any){
    $('.loader').show();
    $('.word').hide();

    let date = new Date(this.manuringDate.value);
    let time = new Date(this.manuringTime.value);
    
    let d = date.getFullYear().toString() +"-"+ ("0" + (date.getMonth()+1).toString()).slice(-2) +"-"+ ("0" + date.getDate().toString()).slice(-2);
    let t = ("0" + time.getHours().toString()).slice(-2) + ":" + ("0" + time.getMinutes().toString()).slice(-2);
    
    this.asset = {
      $class: 'org.ucsc.agriblockchain.Activity',
      'plot': "resource:org.ucsc.agriblockchain.Plot#" + this.plotId.value,
      'activitytype': 'MANURING',
      'amount': this.amount.value,
      'time': d + "T" + t + ":00.000Z",
    };

    if($('#fertilizer').val() != ""){
      this.manureType = 'FERTILIZER';
      this.asset.fertilizer = "resource:org.ucsc.agriblockchain.Fertilizer#" + this.fertilizer.value;
    }
    
    if($('#pesticide').val() != ""){
      this.manureType = 'PESTICIDE';
      this.asset.pesticide = "resource:org.ucsc.agriblockchain.Pesticide#" + this.pesticide.value;
    }
    
    return this.toggleLoad = this.serviceActivity.addTransaction(this.asset)
    .toPromise()
    .then(() => {  
      let ret;
      
      if($('#fertilizer').val() != ""){
        ret = this.loadFert(this.fertilizer.value); 
      }
      
      if($('#pesticide').val() != ""){
        ret = this.loadPest(this.pesticide.value); 
      }
      
      return ret;
    })
    .then((manure)=>{      
      let certi = {
        $class: "org.ucsc.agriblockchain.Certification",
        "certificationNo": manure.certification.certificationNo,
        "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + manure.certification.certificationBody.stakeholderId,
        "from": manure.certification.from,
        "to": manure.certification.to,
        "images": manure.certification.images,
      };

      this.asset = {        
        'name': manure.name,
        'manufactureDate': manure.manufactureDate,
        'expiryDate': manure.expiryDate,
        'dateOfSale': manure.dateOfSale,
        'amount': manure.amount - this.amount.value,
        'price': manure.price,
        'activeChemicals': manure.activeChemicals,
        'certification': certi,
        'currentOwner': "resource:org.ucsc.agriblockchain.Stakeholder#" + manure.currentOwner.stakeholderId,
        'issuer': "resource:org.ucsc.agriblockchain.Stakeholder#" + manure.issuer.stakeholderId,
        'divideStatus': manure.divideStatus,
        'activeStatus': manure.activeStatus
      };

      if(manure.hasOwnProperty('parentProduct')) {                        
        this.asset.parentProduct = manure.parentProduct;   
      }

      if($('#fertilizer').val() != ""){
        this.asset.$class = 'org.ucsc.agriblockchain.Fertilizer';
        this.serviceFertilizer.updateAsset(manure.fertilizerId, this.asset)
        .toPromise()
      }
      
      if($('#pesticide').val() != ""){
        this.asset.$class = 'org.ucsc.agriblockchain.Pesticide';
        this.servicePesticide.updateAsset(manure.pesticideId, this.asset)
        .toPromise()
      }      

    })          
    .then(()=>{
      this.errorMessage = null;
      this.loadPlots();

      $('#manuringModal .close').trigger('click');
      swal(
        'Success!',
        'Manuring logged successfully!',
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

  setManure(ele) {
    if(ele == "Fertilizer"){
      $("#fertRow").show();
      $("#pestRow").hide();
      $('#pesticide').val('').change();
    }
    else if(ele == "Pesticide"){
      $("#fertRow").hide();
      $("#pestRow").show();
      $('#fertilizer').val('').change();
    }
  }

}
