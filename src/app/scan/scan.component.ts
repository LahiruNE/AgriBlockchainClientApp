import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ProductService } from '../Product/Product.service';
import { Product } from '../org.ucsc.agriblockchain';
import $ from 'jquery';
import { DataService } from '../data.service';
import { ActivityService } from '../Activity/Activity.service';
import { PlotService } from '../Plot/Plot.service';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
  providers: [PlotService,ProductService,ActivityService]
})
export class ScanComponent implements OnInit {
  myForm: FormGroup;
  private errorMessage;
  private allAssets;
  private productdetails;
  private plotdetails;
  private productspath;
  private farmdetails;
  private pluckeddate;
  private preqty;
  private farmcomments;
  private plotcomments;
  private newQty;
  private phread;
  private actitype;
  private onlyacti;
  private activity;
  private cultdate;
  private trandays;

  private seededArr = {};
  private harvestedArr = {};
  private growCountArr = [];
  private withFruitCountArr = [];
  private destroyedCountArr = [];

  private growCountData = [];
  private growCountLabels = [];
  private withFruitCountData = [];
  private withFruitCountLabels = [];
  private destroyedCountData = [];
  private destroyedCountLabels = [];

  private lat = [];
  private long = [];
  private labels = [];
  
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
  
  productId = new FormControl('');
  constructor(public serviceData: DataService<Product>,public servicePlot: PlotService,public serviceProduct: ProductService,private fb: FormBuilder,public serviceActivity: ActivityService) { 

    this.myForm = fb.group({
      productId: this.productId,
    });
    
  }

  ngOnInit() {
    $('.history').hide();
    this.loadAll();
    $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
      e.preventDefault();
      $(this).siblings('a.active').removeClass("active");
      $(this).addClass("active");
      var index = $(this).index();
      $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
      $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
  });
  
  }
  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceProduct.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
      console.log(this.allAssets);
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

cls(){
  $('.history').show();
  document.getElementById('historyview').scrollIntoView(true);
}

days()
{
  var da1 = this.cultdate.split('T')[0];
  var da2 = this.pluckeddate.split('T')[0];
  var date1 = new Date(da1);
  var date2 = new Date(	da2);
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  this.trandays = diffDays;
}  

getproduct(id){
    const path =[];
    const productdata =[];
    const plotdata = [];
    const farmdata = [];

    return this.serviceProduct.getAsset(id)
    .toPromise()
    .then((result) => {
      this.getFormForView(result.plot.plotId);
      this.preqty = result.quantity;
      this.farmcomments = result.plot.farm.certificationactivity;
      this.plotcomments = result.plot.certificationactivity;
      this.productspath = result.productpath;
      this.cultdate = result.plot.seededDate;
      this.pluckeddate = result.pluckedDate;
      this.phread = result.plot.phReadings;
      this.activity = result.plot.activities;
      productdata.push(result);
      plotdata.push(result.plot);
      farmdata.push(result.plot.farm);
      this.productdetails = productdata;
      this.plotdetails = plotdata;
      this.farmdetails = farmdata;
            
      this.lat.push(parseFloat(result.plot.farm.lat));
      this.long.push(parseFloat(result.plot.farm.long));
      this.labels.push('1 - Farm');

      let count = 2; 
      this.productspath.forEach((path)=>{
        this.lat.push(parseFloat(path.authperson.lat));
        this.long.push(parseFloat(path.authperson.long));

        this.labels.push(count + ' - ' + path.authperson.name);
        count++;
      });

      console.log(this.lat);
      console.log(this.long);
      

    }) 
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
      console.log(result);
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

      /* if (result.certificationBodyComments) {
        formObject.certificationBodyComments = result.certificationBodyComments;

        this.certiicationComment = result.certificationBodyComments;
      } else {
        formObject.certificationBodyComments = null;
      } */

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
