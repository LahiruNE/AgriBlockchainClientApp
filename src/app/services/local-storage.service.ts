import { Component, AfterViewInit, OnInit, Inject, Injectable } from '@angular/core';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Injectable()
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) {}

  saveInLocal(key, val): void {
    console.log('recieved= key:' + key + 'value:' + val);
    this.storage.set(key, val);
  }

  getFromLocal(key) {
    console.log('recieved= key:' + key);
    return this.storage.get(key);
  }


}
