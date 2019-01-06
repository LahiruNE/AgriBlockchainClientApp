import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { FarmService } from '../Farm/Farm.service';
import { Farm } from '../org.ucsc.agriblockchain';
import {DiaryService} from '../services/diary.service';
import 'rxjs/add/operator/toPromise';
import { LocalStorageService } from '../services/local-storage.service';
import $ from 'jquery';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import swal from 'sweetalert2';
import { DataService } from '../data.service';
import { PlotService } from '../Plot/Plot.service';


@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css'],
  providers: [PlotService,FarmService,DiaryService, DataService]
})
export class DiaryComponent implements OnInit {

  colorTheme = 'theme-dark-blue';
  bsConfig = Object.assign({}, { containerClass: this.colorTheme },{dateInputFormat: 'YYYY-MM-DD'});

  recordForm: FormGroup;

  private errorMessage;
  private availFarms = [];
  private availPlots = [];
  private allRecords =[];
  private rec;
  private toggleLoad;

  farmId = new FormControl('', Validators.required);
  recorddate = new FormControl('');
  records = new FormControl('');
  recordtime = new FormControl('');
  plotId = new FormControl('');

  constructor(public servicePlot: PlotService, private localStorageService : LocalStorageService, public serviceData: DataService<Farm>,public serviceFarm: FarmService,fb: FormBuilder,public serviceDiary:DiaryService) { 
    this.recordForm = fb.group({
      farmId: this.farmId,
      recorddate : this.recorddate,
      recordtime : this.recordtime,
      records : this.records,
      plotId : this.plotId
    }); 

  }

  ngOnInit() {
    this.loadFarms();
    this.loadPlots();
    this.loadRecords();
  }
/*   loadFarms(): Promise<any>{
    const tempList = [];
    let user = "resource%3Aorg.ucsc.agriblockchain.Stakeholder%23" + this.localStorageService.getFromLocal('currentUser').stakeholderId;
    return this.serviceData.getOwnedFarms(user)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        this.availFarms.push(asset);
      });
      console.log(this.availFarms);
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
  } */

  loadPlots(): Promise<any> {
    const tempList = [];
    return this.servicePlot.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.availPlots = tempList;
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

  loadFarms(): Promise<any>{
    const tempList = [];
    return this.serviceFarm.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.availFarms = tempList;
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



  loadRecords(): Promise<any>{
    let user = "resource%3Aorg.ucsc.agriblockchain.Stakeholder%23" + this.localStorageService.getFromLocal('currentUser').stakeholderId;
    return this.serviceData.getOwnedDiary(user)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      this.allRecords = []; 

      result.forEach(asset => {
        this.allRecords.push(asset);
      });
      console.log(this.allRecords);
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

  addRecord(form: any){
    $('.loader').show();
    $('.word').hide();
    let date = new Date(this.recorddate.value);
    let time = new Date(this.recordtime.value);
    let d = date.getFullYear().toString() +"-"+ ("0" + (date.getMonth()+1).toString()).slice(-2) +"-"+ ("0" + date.getDate().toString()).slice(-2);
    let t = ("0" + time.getHours().toString()).slice(-2) + ":" + ("0" + time.getMinutes().toString()).slice(-2);

    this.rec = {
      $class: "org.ucsc.agriblockchain.Diary",
      'date': this.recorddate.value,
      'record': "Plot #"+ this.plotId.value + " : " + this.records.value,
      'time':d + "T" + t + ":00.000Z",
      'farm': "resource:org.ucsc.agriblockchain.Farm#"+this.farmId.value,
      'owner': "resource:org.ucsc.agriblockchain.Stakeholder#"+ this.localStorageService.getFromLocal('currentUser').stakeholderId
    };
    console.log(this.rec);
    
    return this.toggleLoad = this.serviceDiary.addTransaction(this.rec)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadFarms();
      this.loadRecords();

      $('#addrecord .close').trigger('click');
      swal(
        'Success!',
        'Record is added successfully!',
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

  resetForm(): void {
    this.recordForm.setValue({
      'farmId': null,
      'recorddate':null,
      'recordtime':null,
      'records' :null
                     
    });
  }
}
