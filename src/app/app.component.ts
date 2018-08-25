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

import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import $ from 'jquery';
import {LocalStorageService} from './services/local-storage.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor( private localStorageService: LocalStorageService) {
     
  }

  public data:any=[]

  private isLoggedIn = this.localStorageService.getFromLocal('isLoggedIn');
  private isError = false;
  private error = "";

  private loginData = {
    username : "",
    password : ""
  }

  ngOnInit(){
  }

  onLogIn(username:NgModel, password:NgModel){
    if(!username.valid || !password.valid){
      this.isError = true;
      this.error = "Username or Password cannot be empty!";
    }
    else{
      this.isError = false;
      this.localStorageService.saveInLocal("loginData",this.loginData);
      this.localStorageService.saveInLocal("isLoggedIn",true);
      this.isLoggedIn = this.localStorageService.getFromLocal('isLoggedIn');
    }
    
  }  

}





