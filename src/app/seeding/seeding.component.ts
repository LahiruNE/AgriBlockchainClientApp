import { Component, OnInit } from '@angular/core';
import { PlotService } from '../Plot/Plot.service';

@Component({
  selector: 'app-seeding',
  templateUrl: './seeding.component.html',
  styleUrls: ['./seeding.component.css'],
  providers: [PlotService]
})
export class SeedingComponent implements OnInit {

  private errorMessage;
  private availPlots = {};
  private seededPlots = {};
  private farms = [];


  constructor( public servicePlot: PlotService) { }

  ngOnInit() {
    this.loadPlots();
  }

  loadPlots() {
    return this.servicePlot.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        if(this.farms.indexOf(asset.farm.farmId) == -1){
          this.farms.push(asset.farm.farmId);
        }

        

        if(asset.status.toString() != "SEEDED"){
          if(this.availPlots.hasOwnProperty(asset.farm.farmId)){
            this.availPlots[asset.farm.farmId].push(asset);
          }
          else{
            this.availPlots[asset.farm.farmId] = [asset];
          }
           
        }
        else{
          if(this.seededPlots.hasOwnProperty(asset.farm.farmId)){
            this.seededPlots[asset.farm.farmId].push(asset);
          }
          else{
            this.seededPlots[asset.farm.farmId] = [asset];
          }
        }
      });

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

}
