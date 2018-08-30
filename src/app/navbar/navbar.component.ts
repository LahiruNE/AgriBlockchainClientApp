import { Component, OnInit, AfterViewInit } from '@angular/core';
import $ from 'jquery';
import { LocalStorageService } from '../services/local-storage.service';
import {DataService} from '../data.service';
import { Stakeholder } from '../org.ucsc.agriblockchain';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {

  constructor(private localStorageService : LocalStorageService, private dataService: DataService<Stakeholder>) { }

  ngAfterViewInit() {
    $('.navbar-nav a').on('click', function(){
      $('.navbar-nav').find('.active').removeClass('active');
      $(this).addClass('active');
    });
    
    $('.dropdown-item').on('click', function(){
      $('.navbar-nav').find('.active').removeClass('active');
      $(this).parent.addClass('active');
    });

  
  }

  logOut(){
    this.setUser()
      .then((stat) => {
        this.localStorageService.saveInLocal('isLoggedIn', false);
        location.reload();
      })  
    
  }

  setUser(){
    return this.dataService.setUser('admin').toPromise();
  }

}
