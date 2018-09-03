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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { AdminComponent } from './admin/admin.component';
import { RegisterstakeholderComponent } from './registerstakeholder/registerstakeholder.component';

import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Product', component: ProductComponent },
  { path: 'Plot', component: PlotComponent },
  { path: 'Farm', component: FarmComponent },
  { path: 'Seed', component: SeedComponent },
  { path: 'Fertilizer', component: FertilizerComponent },
  { path: 'Pesticide', component: PesticideComponent },
  { path: 'Stakeholder', component: StakeholderComponent },
  { path: 'TransferPackage', component: TransferPackageComponent },
  { path: 'DivideAsset', component: DivideAssetComponent },
  { path: 'MergeAsset', component: MergeAssetComponent },
  { path: 'PHReading', component: PHReadingComponent },
  { path: 'Activity', component: ActivityComponent },
  { path: 'Admin', component: AdminComponent },
  { path: 'FarmerHome', component: FarmerDashboardComponent },
  { path: 'StakeholderRegister', component: RegisterstakeholderComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
