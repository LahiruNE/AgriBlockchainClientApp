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

    let status = this.validate(username, password);

    if(status['isError'] == true){
      this.isError = true;
      this.error = status['error'];
    }    
    else{
      this.isError = false;
      this.localStorageService.saveInLocal("loginData",this.loginData);
      this.localStorageService.saveInLocal("isLoggedIn",true);
      this.isLoggedIn = this.localStorageService.getFromLocal('isLoggedIn');
    }
    
  } 
  
  validate(username:NgModel, password:NgModel){
    let validStatus = {};
    
    if(!username.valid || !password.valid){
      validStatus['isError'] = true;
      validStatus['error'] = "Username or Password cannot be empty!";
    }
    else if(!this.isUsernameAvailable()){
      validStatus['isError'] = true;
      validStatus['error'] = "Entered username is not valid!";
    }
    else if(!this.isPasswordMatch()){
      validStatus['isError'] = true;
      validStatus['error'] = "Incorrect password!";
    }

    return validStatus;
  }

  isUsernameAvailable(){
    return true;
  }

  isPasswordMatch(){
    return true;
  }

}