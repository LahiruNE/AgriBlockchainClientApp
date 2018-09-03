import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Stakeholder } from '../org.ucsc.agriblockchain';
import 'rxjs/Rx';

@Injectable()
export class RegisterService {
  private NAMESPACE = 'org.ucsc.agriblockchain.Stakeholder';
  constructor(private dataService: DataService<Stakeholder>) { }

  public getAll(): Observable<Stakeholder[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getparticipant(id: any): Observable<Stakeholder> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addParticipant(itemToAdd: any): Observable<Stakeholder> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateParticipant(id: any, itemToUpdate: any): Observable<Stakeholder> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteParticipant(id: any): Observable<Stakeholder> {
    return this.dataService.delete(this.NAMESPACE, id);
  }

}
