import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Inspection } from '../org.ucsc.agriblockchain';
import 'rxjs/Rx';

@Injectable()
export class DiaryService {
  private NAMESPACE = 'org.ucsc.agriblockchain.Diary';
  constructor(private dataService: DataService<Inspection>) { }
  public getAll(): Observable<Inspection[]> {
    return this.dataService.getAll(this.NAMESPACE);
}

public getTransaction(id: any): Observable<Inspection> {
  return this.dataService.getSingle(this.NAMESPACE, id);
}

public addTransaction(itemToAdd: any): Observable<Inspection> {
  return this.dataService.add(this.NAMESPACE, itemToAdd);
}

public updateTransaction(id: any, itemToUpdate: any): Observable<Inspection> {
  return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
}

public deleteTransaction(id: any): Observable<Inspection> {
  return this.dataService.delete(this.NAMESPACE, id);
}

}
