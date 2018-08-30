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
import { StakeholderService } from './Stakeholder.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-stakeholder',
  templateUrl: './Stakeholder.component.html',
  styleUrls: ['./Stakeholder.component.css'],
  providers: [StakeholderService]
})
export class StakeholderComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;
  

  stakeholderId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  city = new FormControl('', Validators.required);
  country = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  telephone = new FormControl('', Validators.required);
  certification = new FormControl('', Validators.required);
  images = new FormControl('', Validators.required);
  companyname = new FormControl('', Validators.required);
  companycity = new FormControl('', Validators.required);
  companycountry = new FormControl('', Validators.required);
  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  authPerson = new FormControl('', Validators.required);
  farms = new FormControl('', Validators.required);
  vehicleNo = new FormControl('', Validators.required);
  distributionType = new FormControl('', Validators.required);
  branchNo = new FormControl('', Validators.required);


  constructor(public serviceStakeholder: StakeholderService, fb: FormBuilder) {
    this.myForm = fb.group({
      stakeholderId: this.stakeholderId,
      name: this.name,
      city: this.city,
      country: this.country,
      email: this.email,
      telephone: this.telephone,
      certification: this.certification,
      images: this.images,
      companyname: this.companyname,
      companycity: this.companycity,
      companycountry: this.companycountry,
      username: this.username,
      password: this.password,
      type: this.type,
      description: this.description,
      authPerson: this.authPerson,
      farms: this.farms,
      vehicleNo: this.vehicleNo,
      distributionType: this.distributionType,
      branchNo: this.branchNo
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceStakeholder.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
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
      'certification': this.certification.value,
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
      'farms':[ 
        this.farms.value
      ],
      'vehicleNo': this.vehicleNo.value,
      'distributionType': this.distributionType.value,
      'branchNo': this.branchNo.value
    };

    this.myForm.setValue({
      'stakeholderId': null,
      'name': null,
      'city': null,
      'country': null,
      'email': null,
      'telephone': null,
      'certification': null,
      'images': null,
      'companyname': null,
      'companycity': null,
      'companycountry': null,
      'username': null,
      'password': null,
      'type': null,
      'description': null,
      'authPerson': null,
      'farms': null,
      'vehicleNo': null,
      'distributionType': null,
      'branchNo': null
    });

    return this.serviceStakeholder.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'stakeholderId': null,
        'name': null,
        'city': null,
        'country': null,
        'email': null,
        'telephone': null,
        'certification': null,
        'images': null,
        'companyname': null,
        'companycity': null,
        'companycountry': null,
        'username': null,
        'password': null,
        'type': null,
        'description': null,
        'authPerson': null,
        'farms': null,
        'vehicleNo': null,
        'distributionType': null,
        'branchNo': null
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


/*    updateParticipant(form: any): Promise<any> {
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
      'certification': this.certification.value,
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
      'farms': [ 
        this.companyname.value
      ],
      'vehicleNo': this.vehicleNo.value,
      'distributionType': this.distributionType.value,
      'branchNo': this.branchNo.value
    };
    return this.serviceStakeholder.updateParticipant(form.get('stakeholderId').value, this.participant)
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
 */

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
        'certification': null,
        'images': null,
        'companyname': null,
        'companycity': null,
        'companycountry': null,
        'username': null,
        'password': null,
        'type': null,
        'description': null,
        'authPerson': null,
        'farms': null,
        'vehicleNo': null,
        'distributionType': null,
        'branchNo': null
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

      if (result.certification) {
        formObject.certification = result.certification;
      } else {
        formObject.certification = null;
      }

      if (result.images) {
        formObject.images = result.images;
      } else {
        formObject.images = null;
      }

      if (result.company.address.city) {
        formObject.city = result.company.address.city;
      } else {
        formObject.city = null;
      }
      if (result.company.address.country) {
        formObject.country = result.company.address.country;
      } else {
        formObject.country = null;
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

      if (result.farms) {
        formObject.farms = result.farms;
      } else {
        formObject.farms = null;
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

  resetForm(): void {
    this.myForm.setValue({
      'stakeholderId': null,
      'name': null,
      'city': null,
      'country': null,
      'email': null,
      'telephone': null,
      'certification': null,
      'images': null,
      'companyname': null,
      'companycity': null,
      'companycountry': null,
      'username': null,
      'password': null,
      'type': null,
      'description': null,
      'authPerson': null,
      'farms': null,
      'vehicleNo': null,
      'distributionType': null,
      'branchNo': null
    });
  }
}
