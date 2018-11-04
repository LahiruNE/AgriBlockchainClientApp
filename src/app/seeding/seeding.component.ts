import { Component, OnInit } from '@angular/core';
import { PlotService } from '../Plot/Plot.service';
import { SeedService } from '../Seed/Seed.service';
import { Plot } from '../org.ucsc.agriblockchain';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';
import swal from 'sweetalert2';


@Component({
  selector: 'app-seeding',
  templateUrl: './seeding.component.html',
  styleUrls: ['./seeding.component.css'],
  providers: [PlotService, SeedService]
})
export class SeedingComponent implements OnInit {
  myForm: FormGroup;

  private errorMessage;
  private availPlots = {};
  private seededPlots = {};
  private farms = [];
  private certificationComment = [];
  private toggleLoad;
  private asset;
  private availSeeds = [];

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

  constructor(private localStorageService: LocalStorageService, public servicePlot: PlotService, public serviceSeed: SeedService,fb: FormBuilder) {
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
    });
  };

  ngOnInit() {
    this.loadPlots();
    this.loadSeeds();

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

  loadSeeds() {
    this.availSeeds = [];

    return this.serviceSeed.getAll()
    .toPromise()
    .then((seed) => {
      this.errorMessage = null;
      seed.forEach(asset => {
        if(asset.amount > 0){
            this.availSeeds.push(asset);
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

  loadSeed(id) {
    return this.serviceSeed.getAsset(id)
    .toPromise()
  }


  loadPlots() {
    this.availPlots = {};
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

        if(asset.status.toString() != "SEEDED"){
          if(this.availPlots.hasOwnProperty(asset.farm.farmId)){
            this.availPlots[asset.farm.farmId].push(asset);
          }
          else{
            this.availPlots[asset.farm.farmId] = [asset];
          }
           
        }
        else{
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
      $('#seed1').click();
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

    let seedId = this.getSeedId('cultivatedType_'+this.plotId.value);

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
      'seededDate': this.seededDate.value,
      'extent': this.extent.value,
      'closerplots' : plots,
      'activities': this.activities.value,
      'phReadings': this.phReadings.value,
      'certificationBodyComments': this.certificationBodyComments.value,
      'status' : "SEEDED",
      'cultivatedType' : this.cultivatedType.value,
      'farm': "resource:org.ucsc.agriblockchain.Farm#" + this.farm.value,
    };
    
    return this.toggleLoad = this.servicePlot.updateAsset(form.get('plotId').value, this.asset)
    .toPromise()
    .then(() => {
      return this.loadSeed(seedId);      
    })
    .then((seed)=>{
      let certi = {
        $class: "org.ucsc.agriblockchain.Certification",
        "certificationNo": seed.certification.certificationNo,
        "certificationBody": "resource:org.ucsc.agriblockchain.Stakeholder#" + seed.certification.certificationBody.stakeholderId,
        "from": seed.certification.from,
        "to": seed.certification.to,
        "images": seed.certification.images,
      }

      this.asset = {
        $class: 'org.ucsc.agriblockchain.Seed',
        'name': seed.name,
        'manufactureDate': seed.manufactureDate,
        'expiryDate': seed.expiryDate,
        'dateOfSale': seed.dateOfSale,
        'type': seed.type,
        'amount': seed.amount - this.amount.value,
        'price': seed.price,
        'activeChemicals': seed.activeChemicals,
        'certification': certi,
        'currentOwner': "resource:org.ucsc.agriblockchain.Stakeholder#" + seed.currentOwner.stakeholderId,
        'issuer': "resource:org.ucsc.agriblockchain.Stakeholder#" + seed.issuer.stakeholderId,
        'divideStatus': seed.divideStatus,
        'activeStatus': seed.activeStatus
      };

      if(seed.hasOwnProperty('parentProduct')) {                        
        this.asset.parentProduct = seed.parentProduct;   
      }

      return this.serviceSeed.updateAsset(seed.seedId, this.asset)
      .toPromise()

    })
    .then(()=>{
      this.errorMessage = null;
      this.loadPlots();
      this.loadSeeds();

      $('#seedingModal .close').trigger('click');
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

  getSeedId(id) {
    return $("#"+id).find('option:selected').attr('data-seedId');
  }

}
