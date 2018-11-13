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
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import $ from 'jquery';
import { StakeholderService } from './Stakeholder.service';
import 'rxjs/add/operator/toPromise';
import { DataService } from '../data.service';
import { Stakeholder } from '../org.ucsc.agriblockchain';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AddParticipant } from '../org.hyperledger.composer.system';
import { InspectionService } from '../services/inspection.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-stakeholder',
  templateUrl: './Stakeholder.component.html',
  styleUrls: ['./Stakeholder.component.css'],
  providers: [StakeholderService,InspectionService]
})
export class StakeholderComponent implements OnInit {

  minDate: Date;
  colorTheme = 'theme-dark-blue';
  bsConfig = Object.assign({}, { containerClass: this.colorTheme },{dateInputFormat: 'YYYY-MM-DD'});
  

  myForm: FormGroup;
  commentForm:FormGroup;

  maintype:String;
  loggingUser:string;
  loggingType: string;
  loggingId: string;
  StakeholderType :String;
  TypeofTransaction :String;

  private allParticipants;
  private alldata;
  private userHistorians;
  private onlyaddasset;
  private onlyactivities;
  private onlyupdates;
  private onlytransfers;
  private onlyinspections;
  private transactionHistorians;
  private Participants;
  private participant;
  private identity;
  private currentId;
  private errorMessage;
  private clas;
  private comm;


  stakeholderId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  city = new FormControl('', Validators.required);
  country = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  telephone = new FormControl('', Validators.required);
  certificationNo = new FormControl('', Validators.required);
  certificationBody = new FormControl('', Validators.required);
  from = new FormControl('', Validators.required);
  to = new FormControl('', Validators.required);
  images = new FormControl('', Validators.required);
  companyname = new FormControl('', Validators.required);
  companycity = new FormControl('', Validators.required);
  companycountry = new FormControl('', Validators.required);
  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  authPerson = new FormControl('', Validators.required);
  vehicleNo = new FormControl('', Validators.required);
  distributionType = new FormControl('', Validators.required);
  branchNo = new FormControl('', Validators.required);
  comment = new FormControl('', Validators.required);
  rating = new FormControl('', Validators.required);

  inspectiondate = new FormControl('');
  cercomments = new FormControl('');
  commenttime = new FormControl('');

  constructor(private localStorageService : LocalStorageService,private router: ActivatedRoute,private normalRouter: Router,public dataService: DataService<Stakeholder>,public serviceStakeholder: StakeholderService,public serviceInspection : InspectionService, fb: FormBuilder) {
    this.myForm = fb.group({
      stakeholderId: this.stakeholderId,
      name: this.name,
      city: this.city,
      country: this.country,
      email: this.email,
      telephone: this.telephone,
      certificationNo:this.certificationNo,
      certificationBody:this.certificationBody,
      from:this.from,
      to:this.to,
      images: this.images,
      companyname: this.companyname,
      companycity: this.companycity,
      companycountry: this.companycountry,
      username: this.username,
      password: this.password,
      type: this.type,
      description: this.description,
      authPerson: this.authPerson,
      vehicleNo: this.vehicleNo,
      distributionType: this.distributionType,
      branchNo: this.branchNo,
      comment: this.comment,
      rating: this.rating
    });

    this.commentForm = fb.group({
      stakeholderId: this.stakeholderId,
      inspectiondate : this.inspectiondate,
      commenttime : this.commenttime,
      cercomments : this.cercomments
    }); 

  };

  ngOnInit(): void {
  
  /* $('.history').hide(); */

  this.loggingUser = this.localStorageService.getFromLocal('currentUser').name;
  console.log('logname'+this.loggingUser)
  this.loggingType = this.localStorageService.getFromLocal('currentUser').type;
  console.log(this.loggingType)
  /* this.loggingId = this.localStorageService.getFromLocal('currentUser').stakeholderId;
  console.log('logname'+this.loggingId) */

  /* $("select").change(function(){
    $("option:selected",this).text().trim().toLowerCase() == "Active" ? $(this).closest("tr").css("background-color","red") : $(this).closest("tr").css("background-color","green")
    
    })
   */
/* $('.historianwrapper').hide(); */
$('#stage1').trigger('click');

 $(document).ready(function () {

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
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-primary').trigger('click');
});
 


    this.router.params.subscribe((params) => {
      this.StakeholderType = params['id']
      console.log(this.StakeholderType)
      if(this.loggingType == 'ADMIN'){
        this.loadAll();
      }
      else{
        this.loadALLNext();
      }
     
    })


    const certtempList = [];
    let  certtype;
   
    this.serviceStakeholder.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        certtype = participant.type 
        if( certtype == 'CERTIFICATION'){
          certtempList.push(participant);
        }
        
       
      });
      this.Participants = certtempList;
      console.log( this.Participants)
    })

   this.getStakeholder();
    
    
  }

 /*  getStakeholder(id: any):Promise<any> {
    const userHistorian = [];
    console.log(id)
    return this.dataService.getHistorianstakeholder(id)
    .toPromise()
    .then((stake) => {
      stake.forEach(userhis =>{
          userHistorian.push(userhis)
      })
      this.userHistorians = userHistorian;
      console.log(this.userHistorians)
      console.log('It works')
    })
    
  } */

  getStakeholder():Promise<any> {
    const userHistorian = [];
    const tranHistorian =[];
    const addasset = [];
    const onlyactivity = [];
    const onlytransfer = [];
    const onlyupdate = [];
    const onlyinspection = [];
    return this.dataService.getHistorianstakeholder()
    .toPromise()
    .then((stake) => {
      stake.forEach(userhis =>{
          let arr = userhis.transactionType.split(".");
          let txType = arr[arr.length-1];
          tranHistorian.push(txType)
          userHistorian.push({all:userhis,type:txType})
          if(txType == 'AddAsset'){
            addasset.push(userhis)
          }
          if(txType == 'Activity'){
            onlyactivity.push(userhis)
          }
          if(txType == 'TransferPackage'){
            
            onlytransfer.push(userhis)
          }
          if(txType == 'UpdateAsset'){
            
            onlyupdate.push(userhis)
          }
          if(txType == 'Inspection'){
            
            onlyinspection.push(userhis)
          }
          
          
      })
      this.onlyupdates = onlyupdate;
      this.onlyaddasset = addasset;
      this.onlyinspections = onlyinspection; 
      console.log(this.onlyaddasset)
      this.onlyactivities = onlyactivity;
      console.log( this.onlyactivities)
      this.onlytransfers = onlytransfer;
      console.log(this.onlytransfers);
      this.transactionHistorians = tranHistorian;
      this.userHistorians = userHistorian;
      console.log(this.userHistorians)
      console.log(this.transactionHistorians)
      let arr= this.userHistorians.concat(this.transactionHistorians);
      console.log(arr)
    })
    
  }
  cls(){
    $('.history').show();
    document.getElementById('historyview').scrollIntoView(true);
  }

  loadAll(): Promise<any> {
    const tempList = [];
    let  maintype;
    let certbody;
     
    return this.serviceStakeholder.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        maintype = participant.type 
        if( maintype == this.StakeholderType){
          tempList.push(participant);

        }
        this.allParticipants = tempList;
      });
      
      console.log( this.allParticipants)
      
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

  loadALLNext(){
    const tempList = [];
    let  maintype;
    let certbody;
     
    return this.serviceStakeholder.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        maintype = participant.type 
        certbody = participant.certification.certificationBody.name
        console.log("cert"+certbody)
        if( maintype == this.StakeholderType){
          if(certbody == this.loggingUser){
            tempList.push(participant);
            
          }

        }
        this.allParticipants = tempList;
      });
      
      console.log( this.allParticipants)
      
    })
  }

  userHis(asset){
    var trantid = asset.split('#');
    var trantype = asset.split('.')
    const data = [];
    
    
    
    var transactiontype = trantype[trantype.length-1].split('#')
    var tratype = transactiontype[0]
    var transactionId = trantid[trantid.length-1]
    this.TypeofTransaction = tratype;
    console.log(tratype)
    console.log(transactionId)
    if(tratype == 'IssueIdentity'){
      return this.dataService.getHistorianissueidentity(transactionId)
    .toPromise()
    .then((iden) => {
      iden.forEach(datalist => {
          data.push(datalist);
          
      });
      this.alldata = data;
      console.log(this.alldata)
     
    })
    }
    if(tratype == 'AddParticipant'){
      return this.dataService.getHistorianaddparticipant(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist.resources[0]);
            
            
        });
        this.alldata = data;
        console.log(this.alldata)
        
      })
    }
    if(tratype == 'UpdateParticipant'){
      return this.dataService.getHistorianupdateparticipant(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist.resources[0]);
            
        });
        this.alldata = data;
        console.log(this.alldata)
        
      })
    }
    if(tratype == 'AddAsset'){
      return this.dataService.getHistorianaddasset(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist.resources[0]);
            this.clas = datalist.resources[0].$class 
        });
        this.alldata = data;
        console.log(this.onlyaddasset)
        console.log('hel='+this.clas)
        console.log('class='+this.clas)
      })
    }
    if(tratype == 'UpdateAsset'){
      return this.dataService.getHistorianupdateasset(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist.resources[0]);
            this.clas = datalist.resources[0].$class 
        });
        this.alldata = data;
        console.log(this.alldata)
        console.log('class='+this.clas)
      })
    }
    if(tratype == 'Activity'){
      return this.dataService.getHistorianactivity(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist);
            this.clas = datalist.$class 
        });
        this.alldata = data;
        console.log(this.alldata)
        console.log('class='+this.clas)
      })
    }
    if(tratype == 'TransferPackage'){
      return this.dataService.getHistoriantransfer(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
         
          data.push(datalist);
          this.clas = datalist.$class 
        });
        this.alldata = data;
        console.log(this.alldata)
        console.log('class='+this.clas)
      })
    }
    if(tratype == 'PHReading'){
      return this.dataService.getHistorianph(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist);
            this.clas = datalist.$class 
        });
        this.alldata = data;
        console.log(this.alldata)
        console.log('class='+this.clas)
      })
    }
    if(tratype == 'Inspection'){
      return this.dataService.getinspection(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist);
            this.clas = datalist.$class 
        });
        this.alldata = data;
        console.log(this.alldata)
        console.log('class='+this.clas)
      })
    }
    if(tratype == 'RemoveAsset'){
      return this.dataService.getremove(transactionId)
      .toPromise()
      .then((iden) => {
        iden.forEach(datalist => {
            data.push(datalist);
            this.clas = datalist.$class 
        });
        this.alldata = data;
        console.log(this.alldata)
        console.log('class='+this.clas)
      })
    }
  }

  showDiv(){
    $('.historianwrapper').show();
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.ucsc.agriblockchain.Stakeholder',
      'stakeholderId': this.stakeholderId.value,
      'name': this.name.value,
      'address': {
        '$class': 'org.ucsc.agriblockchain.Address',
        'city': this.city.value,
        'country': this.country.value
      },
      'email': this.email.value,
      'telephone': this.telephone.value,
      'certification': {
        '$class': 'org.ucsc.agriblockchain.Certification',
        'certificationNo': this.certificationNo.value,
        'certificationBody': 'resource:org.ucsc.agriblockchain.Stakeholder#'+this.certificationBody.value,
        'from': this.from.value,
        'to': this.to.value,
      },
      'images': this.images.value,
      'company': {
        '$class': 'org.ucsc.agriblockchain.Company',
        'name': this.companyname.value,
        'address': {
          '$class': 'org.ucsc.agriblockchain.Address',
          'city': this.companycity.value,
          'country': this.companycountry.value
        }
      },
      'username': this.username.value,
      'password': this.password.value,
      'type': this.StakeholderType,
      'description': this.description.value,
      'authPerson': this.authPerson.value, 
      'vehicleNo': this.vehicleNo.value,
      'distributionType': this.distributionType.value,
      'branchNo': this.branchNo.value,
      'comment': this.comment.value,
      'rating': this.rating.value
    };

   /*  this.myForm.setValue({
      'stakeholderId': null,
      'name': null,
      'address': null,
      'email': null,
      'telephone': null,
      'certification': null,
      'images': null,
      'company': null,
      'username': null,
      'password': null,
      'type': null,
      'description': null,
      'authPerson': null,
      'vehicleNo': null,
      'distributionType': null,
      'branchNo': null
    }); */

    return this.serviceStakeholder.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.identity = {
        'participant': 'org.ucsc.agriblockchain.Stakeholder#'+ this.stakeholderId.value,
        'userID': this.username.value,
        'options': {}
      };
      console.log(this.identity)
      return this.dataService.issueIdentity(this.identity).toPromise(); 
    })
    .then((cardData) => {
      console.log('CARD-DATA', cardData);
      
      })

    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'stakeholderId': null,
        'name': null,
        'city': null,
        'country': null,
        'email': null,
        'telephone': null,
        'certificationNo': null,
        'certificationBody':null,
        'from': null,
        'to': null,
        'images': null,
        'companyname': null,
        'companycity': null,
        'companycountry': null,
        'username': null,
        'password': null,
        'type': null,
        'description': null,
        'authPerson': null,
        'vehicleNo': null,
        'distributionType': null,
        'branchNo': null,
        'comment': null,
        'rating': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

/* ================== */

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
    'stakeholder': "resource:org.ucsc.agriblockchain.Stakeholder#"+form.get('stakeholderId').value,
    
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.ucsc.agriblockchain.Stakeholder',
      'name': this.name.value,
      'address': {
        '$class': 'org.ucsc.agriblockchain.Address',
        'city': this.city.value,
        'country': this.country.value
      },
      'email': this.email.value,
      'telephone': this.telephone.value,
      'certification': {
        '$class': 'org.ucsc.agriblockchain.Certification',
        'certificationNo': this.certificationNo.value,
        'certificationBody': 'resource:org.ucsc.agriblockchain.Stakeholder#'+this.certificationBody.value,
        'from': this.from.value,
        'to': this.to.value,
      },
      'images': this.images.value,
      'company': {
        '$class': 'org.ucsc.agriblockchain.Company',
        'name': this.companyname.value,
        'address': {
          '$class': 'org.ucsc.agriblockchain.Address',
          'city': this.companycity.value,
          'country': this.companycountry.value
        }
      },
      'username': this.username.value,
      'password': this.password.value,
      'type': this.type.value,
      'description': this.description.value,
      'authPerson': this.authPerson.value, 
      'vehicleNo': this.vehicleNo.value,
      'distributionType': this.distributionType.value,
      'branchNo': this.branchNo.value,
      'comment' :this.comment.value,
      'rating' :this.rating.value
    };

    return this.serviceStakeholder.updateParticipant(form.get('stakeholderId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      if(this.loggingType == 'ADMIN'){
        this.loadAll();
      }
      if(this.loggingType == 'CERTIFICATION'){
        this.loadALLNext();
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

  deleteParticipant(): Promise<any> {

    return this.serviceStakeholder.deleteParticipant(this.currentId)
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

    return this.serviceStakeholder.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'stakeholderId': null,
        'name': null,
        'city': null,
        'country': null,
        'email': null,
        'telephone': null,
        'certificationNo': null,
        'certificationBody':null,
        'from': null,
        'to': null,
        'images': null,
        'companyname': null,
        'companycity': null,
        'companycountry': null,
        'username': null,
        'password': null,
        'type': null,
        'description': null,
        'authPerson': null,
        'vehicleNo': null,
        'distributionType': null,
        'branchNo': null,
        'comment': null,
        'rating': null
      };

      if (result.stakeholderId) {
        formObject.stakeholderId = result.stakeholderId;
      } else {
        formObject.stakeholderId = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.address.city) {
        formObject.city = result.address.city;
      } else {
        formObject.city = null;
      }
      if (result.address.country) {
        formObject.country = result.address.country;
      } else {
        formObject.country = null;
      }

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
      }

      if (result.telephone) {
        formObject.telephone = result.telephone;
      } else {
        formObject.telephone = null;
      }

      if (result.certification.certificationNo) {
        formObject.certificationNo = result.certification.certificationNo;
      } else {
        formObject.certificationNo = null;
      }

      if (result.certification.certificationBody.stakeholderId) {
        formObject.certificationBody = result.certification.certificationBody.stakeholderId;
      } else {
        formObject.certificationBody = null;
      }

      if (result.certification.from) {
        formObject.from = result.certification.from;
      } else {
        formObject.from = null;
      }

      if (result.certification.to) {
        formObject.to = result.certification.to;
      } else {
        formObject.to = null;
      }

      if (result.images) {
        formObject.images = result.images;
      } else {
        formObject.images = null;
      }


      if (result.company.name) {
        formObject.companyname = result.company.name;
      } else {
        formObject.companyname = null;
      }

      if (result.company.address.city) {
        formObject.companycity = result.company.address.city;
      } else {
        formObject.companycity = null;
      }

      if (result.company.address.country) {
        formObject.companycountry = result.company.address.country;
      } else {
        formObject.companycountry = null;
      }

      if (result.username) {
        formObject.username = result.username;
      } else {
        formObject.username = null;
      }

      if (result.password) {
        formObject.password = result.password;
      } else {
        formObject.password = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.authPerson) {
        formObject.authPerson = result.authPerson;
      } else {
        formObject.authPerson = null;
      }

      if (result.vehicleNo) {
        formObject.vehicleNo = result.vehicleNo;
      } else {
        formObject.vehicleNo = null;
      }

      if (result.distributionType) {
        formObject.distributionType = result.distributionType;
      } else {
        formObject.distributionType = null;
      }

      if (result.branchNo) {
        formObject.branchNo = result.branchNo;
      } else {
        formObject.branchNo = null;
      }
      if (result.comment) {
        formObject.comment = result.comment;
      } else {
        formObject.comment = null;
      }

      if (result.rating) {
        formObject.rating = result.rating;
      } else {
        formObject.rating = null;
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
    return this.serviceStakeholder.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'stakeholderId': null,
        'inspectiondate':null,
        'cercomments':null,
        'commenttime':null
        
        
      };
  
      if (result.stakeholderId) {
        formObject.stakeholderId = result.stakeholderId;
      } else {
        formObject.stakeholderId = null;
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
    this.myForm.setValue({
      'stakeholderId': null,
      'name': null,
      'city': null,
      'country': null,
      'email': null,
      'telephone': null,
      'certificationNo': null,
      'certificationBody':null,
      'from': null,
      'to': null,
      'images': null,
      'companyname': null,
      'companycity': null,
      'companycountry': null,
      'username': null,
      'password': null,
      'type': null,
      'description': null,
      'authPerson': null,
      'vehicleNo': null,
      'distributionType': null,
      'branchNo': null,
      'comment': null,
      'rating': null
    });
  }
}
