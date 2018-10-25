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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ProductComponent } from './Product/Product.component';
import { PlotComponent } from './Plot/Plot.component';
import { FarmComponent } from './Farm/Farm.component';
import { SeedComponent } from './Seed/Seed.component';
import { FertilizerComponent } from './Fertilizer/Fertilizer.component';
import { PesticideComponent } from './Pesticide/Pesticide.component';

import { StakeholderComponent } from './Stakeholder/Stakeholder.component';

import { TransferPackageComponent } from './TransferPackage/TransferPackage.component';
import { DivideAssetComponent } from './DivideAsset/DivideAsset.component';
import { MergeAssetComponent } from './MergeAsset/MergeAsset.component';
import { PHReadingComponent } from './PHReading/PHReading.component';
import { ActivityComponent } from './Activity/Activity.component';

import { StorageServiceModule} from 'angular-webstorage-service';
import { NavbarComponent } from './navbar/navbar.component';
import { LocalStorageService } from './services/local-storage.service';
import { AdminComponent } from './admin/admin.component';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';
import { RegisterstakeholderComponent } from './registerstakeholder/registerstakeholder.component';
import { ScanComponent } from './scan/scan.component';
import { CarouselModule, BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { CertificationhomeComponent } from './certificationhome/certificationhome.component';
import { ImageUploadModule } from "angular2-image-upload";
import { Ng4FilesModule } from 'angular4-files-upload';
import {Angular2PromiseButtonModule} from 'angular2-promise-buttons/dist';
import { NgDatepickerModule } from 'ng2-datepicker';
import Swal from 'sweetalert2';
import { SeedingComponent } from './seeding/seeding.component';
import { HarvestingComponent } from './harvesting/harvesting.component';
import { WateringComponent } from './watering/watering.component';
import { ManuringComponent } from './manuring/manuring.component';

import { NgxQRCodeModule } from 'ngx-qrcode2';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    PlotComponent,
    FarmComponent,
    SeedComponent,
    FertilizerComponent,
    PesticideComponent,
    StakeholderComponent,
    TransferPackageComponent,
    DivideAssetComponent,
    MergeAssetComponent,
    PHReadingComponent,
    ActivityComponent,
    NavbarComponent,
    AdminComponent,
    FarmerDashboardComponent,
    RegisterstakeholderComponent,
    ScanComponent,
    CertificationhomeComponent,
    SeedingComponent,
    HarvestingComponent,
    WateringComponent,
    ManuringComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    StorageServiceModule,
    CarouselModule.forRoot(),
    ImageUploadModule.forRoot(),
    Ng4FilesModule,
    BsDatepickerModule.forRoot(),
    Angular2PromiseButtonModule.forRoot({
      spinnerTpl: '<div class="loader"></div>',
      disableBtn: true,
      btnLoadingClass: 'is-loading',
      handleCurrentBtnOnly: false,
    }),
    NgDatepickerModule,
    TimepickerModule.forRoot(),
    NgxQRCodeModule
  ],
  providers: [
    DataService,
    LocalStorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
