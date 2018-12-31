import { Component, OnInit } from '@angular/core';
import { PlotService } from '../Plot/Plot.service';
import { Plot } from '../org.ucsc.agriblockchain';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';
import swal from 'sweetalert2';
import { ProductService } from '../Product/Product.service';


@Component({
  selector: 'app-harvesting',
  templateUrl: './harvesting.component.html',
  styleUrls: ['./harvesting.component.css'],
  providers: [PlotService, ProductService]
})
export class HarvestingComponent implements OnInit {

  colorTheme = 'theme-dark-blue';
  bsConfig = Object.assign({}, { containerClass: this.colorTheme },{dateInputFormat: 'YYYY-MM-DD'});
  myForm: FormGroup;

  private errorMessage;
  private seededPlots = {};
  private farms = [];
  private certificationComment = [];
  private toggleLoad;
  private asset;
  private availSeeds = [];
  private farmOwner;
  private farmCerti;
  private units = ['KG', 'G', 'MT', 'L', 'ML', 'ITEM']; 

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
  harvestedAmount = new FormControl('');
  pluckedDate = new FormControl('');
  unit = new FormControl('');
  certificationactivity = new FormControl('');
  seed = new FormControl('');
  growthProgress = new FormControl('');
  seededAmount = new FormControl('');

  constructor(private localStorageService: LocalStorageService, public servicePlot: PlotService, public serviceProduct: ProductService, fb: FormBuilder) {
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
      harvestedAmount : this.harvestedAmount,
      pluckedDate : this.pluckedDate,
      unit : this.unit,
      certificationactivity : this.certificationactivity,
      seed : this.seed,
      growthProgress : this.growthProgress,
      seededAmount : this.seededAmount
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
      $('#harvest1').click();
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
      'harvestedAmount' : null, 
      'pluckedDate' : null,
      'unit' : null,
      'certificationactivity' : null,
      'seed' : null,
      'growthProgress' : null,
      'seededAmount' : null
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

      this.farmOwner = plot.farm.owner.stakeholderId;
      this.farmCerti = plot.farm.certification;
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

    if (plot.certificationactivity) {
      formObject.certificationactivity = plot.certificationactivity;
    } else {
      formObject.certificationactivity = null;
    }

    if (plot.seed) {
      formObject.seed = plot.seed.seedId;
    } else {
      formObject.seed = null;
    }

    if (plot.growthProgress) {
      formObject.growthProgress = plot.growthProgress;
    } else {
      formObject.growthProgress = null;
    }

    if (plot.seededAmount) {
      formObject.seededAmount = plot.seededAmount;
    } else {
      formObject.seededAmount = null;
    }

    this.myForm.setValue(formObject);

  }

  updateAsset(form: any){
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
      'closerplots' : plots,
      'activities': this.activities.value,
      'phReadings': this.phReadings.value,
      'certificationBodyComments': this.certificationBodyComments.value,
      'status' : "HARVESTED",
      'farm': "resource:org.ucsc.agriblockchain.Farm#" + this.farm.value,
      'seededDate': this.seededDate.value,
      'seededAmount': this.seededAmount.value,
      'seed': "resource:org.ucsc.agriblockchain.Seed#" + this.seed.value,
      'certificationactivity': this.certificationactivity.value,
      'cultivatedType': this.cultivatedType.value,
      'growthProgress': this.growthProgress.value,
    };
    
    return this.toggleLoad = this.servicePlot.updateAsset(form.get('plotId').value, this.asset)
    .toPromise() 
    .then((plot)=>{   
      let certi = {
        $class: "org.ucsc.agriblockchain.Certification",
        "certificationNo": this.farmCerti.certificationNo,
        "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + this.farmCerti.certificationBody.stakeholderId,
        "from": this.farmCerti.from,
        "to": this.farmCerti.to,
        "images": this.farmCerti.images,
      }
  
      this.asset = {
        $class: 'org.ucsc.agriblockchain.Product',
        'productId': "product_" + this.plotId.value,
        'pluckedDate': this.pluckedDate.value,
        'certification': certi,
        'productType': this.cultivatedType.value,
        'quantity': this.harvestedAmount.value,
        'unit': this.unit.value,
        'divideStatus': 'ORIGINAL',
        'activeStatus': 'ACTIVE',
        'plot': "resource:org.ucsc.agriblockchain.Plot#" + this.plotId.value,
        'currentOwner': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.farmOwner,
        'issuer': "resource:org.ucsc.agriblockchain.Stakeholder#" + this.farmOwner,
      };

      return this.serviceProduct.addAsset(this.asset)
        .toPromise()
    })  
    .then(()=>{
      this.errorMessage = null;
      this.loadPlots();

      $('#harvestingModal .close').trigger('click');
      swal(
        'Success!',
        'Harvested successfully!',
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

}

