import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import $ from 'jquery';
import {LocalStorageService} from './services/local-storage.service';
import { NgModel } from '@angular/forms';
import {DataService} from './data.service';
import { Stakeholder } from './org.ucsc.agriblockchain';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor( private localStorageService: LocalStorageService, private dataService: DataService<Stakeholder>) {
     
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

    if(username.valid && password.valid){

      this.isError = false;
      this.localStorageService.saveInLocal("currentUser", {'name' : 'admin'});
      this.localStorageService.saveInLocal("isLoggedIn",true);
      this.isLoggedIn = this.localStorageService.getFromLocal('isLoggedIn');

      /*
      this.isUserAvailable(username.value, password.value)
        .then((result) => {
          if(Object.keys(result).length > 0){
            this.setUser(username.value)
              .then((stat) => {
                this.isError = false;
                this.localStorageService.saveInLocal("currentUser", result[0]);
                this.localStorageService.saveInLocal("isLoggedIn",true);
                this.isLoggedIn = this.localStorageService.getFromLocal('isLoggedIn');
              })                      
          }
          else{
            this.isError = true;;
            this.error = "Wrong username password combination!";
          }
        }) */
    }
    else{
      this.isError = true;;
      this.error = "Username or Password cannot be empty!";
    }  
  } 

  isUserAvailable(username:String, password:String){
    return this.dataService.getUsernamePassword(username, password).toPromise();
  }

  setUser(username:String){
    return this.dataService.setUser(username).toPromise();
  }
}