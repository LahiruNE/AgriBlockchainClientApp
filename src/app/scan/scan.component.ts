import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ProductService } from '../Product/Product.service';
import { Product } from '../org.ucsc.agriblockchain';
import $ from 'jquery';
import { ActivityService } from '../Activity/Activity.service';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
  providers: [ProductService,ActivityService]
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
  private remainingqty;
  private farmcomments;
  private plotcomments;
  private newQty;
  private phread;
  private actitype;
  private onlyacti;
  private activity;
  private cultdate;
  private trandays;
  
  productId = new FormControl('');
  constructor(public serviceProduct: ProductService,private fb: FormBuilder,public serviceActivity: ActivityService) { 

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
    this.remainingqty = 0;
    const path =[];
    const productdata =[];
    const plotdata = [];
    const farmdata = [];
    return this.serviceProduct.getAsset(id)
    .toPromise()
    .then((result) => {
      this.newQty = result.quantity;
      for(let i of result.productpath){
        this.remainingqty = this.newQty - i.Qty
        this.newQty = this.remainingqty;
        path.push({path:i,new:this.remainingqty});
        
      }    
  
      this.farmcomments = result.plot.farm.certificationactivity;
      this.plotcomments = result.plot.certificationactivity;
      this.productspath = path;
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
      console.log(this.productspath) 
      console.log(this.phread);
      console.log(this.activity);
      console.log(this.productdetails);
      console.log( this.plotdetails);
      this.days();
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
}
