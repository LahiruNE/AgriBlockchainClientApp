import { Component, OnInit, AfterViewInit } from '@angular/core';
import $ from 'jquery';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {

  constructor() { }

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

}
