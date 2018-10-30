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

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NgModel } from '@angular/forms';

@Injectable()
export class DataService<Type> {
    private resolveSuffix = '?filter=%7B%22include%22%3A%22resolve%22%7D';
    private actionUrl: string;
    private headers: Headers;
    private ns:string;

    constructor(private http: Http) {
        this.actionUrl = '/api/';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public getAll(ns: string): Observable<Type[]> {
        console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
        return this.http.get(`${this.actionUrl}${ns}` + this.resolveSuffix)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getSingle(ns: string, id: string): Observable<Type> {
        console.log('GetSingle ' + ns);

        return this.http.get(this.actionUrl + ns + '/' + id + this.resolveSuffix)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public add(ns: string, asset: Type): Observable<Type> {
        console.log('Entered DataService add');
        console.log('Add ' + ns);
        console.log('asset', asset);

        return this.http.post(this.actionUrl + ns, asset)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
        console.log('Update ' + ns);
        console.log('what is the id?', id);
        console.log('what is the updated item?', itemToUpdate);
        console.log('what is the updated item?', JSON.stringify(itemToUpdate));
        return this.http.put(`${this.actionUrl}${ns}/${id}`, itemToUpdate)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public delete(ns: string, id: string): Observable<Type> {
        console.log('Delete ' + ns);

        return this.http.delete(this.actionUrl + ns + '/' + id)
          .map(this.extractData)
          .catch(this.handleError);
    }

    private handleError(error: any): Observable<string> {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private extractData(res: Response): any {
        return res.json();
    }


    public getUsernamePassword(username: String, password: String): Observable<Type> {
        let ns = '/queries/getUserFromUsernamePassword'; 
        let param = 'username='+username+'&password='+password;

        console.log(this.actionUrl + ns + '?' + param);

        return this.http.get(this.actionUrl + ns + '?' + param)
          .map(this.extractData)
          .catch(this.handleError);          
    }

    public setUser(username: String): Observable<Type> {
        let ns = '/wallet/'+username+'/setDefault'; 

        console.log(this.actionUrl + ns);

        return this.http.post(this.actionUrl + ns, username)
          .map(this.extractData)
          .catch(this.handleError);          
    }
    public issueIdentity(identity): Observable<Type> {
        this.ns = 'system/identities/issue/'; 
        console.log(identity)
        console.log(this.actionUrl + this.ns);

        return this.http.post(this.actionUrl + this.ns, identity)
          .map(this.extractData)
          .catch(this.handleError);          
    }

    public getStakeholders(type: String, certificationBody: String){
        let ns = 'queries/getFromFarmer';
        let param = 'type='+type+'&certificationBody='+certificationBody;
        console.log(this.actionUrl + ns + '?' + param);
        return this.http.get(this.actionUrl + ns + '?' + param)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getHistorianstakeholder(){
        let ns = 'queries/getFromHistorian';
      /*   let user='resource%3Aorg.ucsc.agriblockchain.Stakeholder%23'+6465; */
        /* console.log(user) */
        let user ='resource%3Aorg.hyperledger.composer.system.NetworkAdmin%23admin';
        console.log(this.actionUrl + ns + '?' + 'Stakeholder='+ user);
        return this.http.get(this.actionUrl + ns + '?' + 'Stakeholder='+ user)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistorianissueidentity(transactionId){
        let ns = 'queries/getFromHistorianidentity';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }

    public getHistorianaddparticipant(transactionId){
        let ns = 'queries/getFromHistorianadd';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistorianupdateparticipant(transactionId){
        let ns = 'queries/getFromHistorianupdate';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistorianaddasset(transactionId){
        let ns = 'queries/getFromHistorianaddasset';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistorianupdateasset(transactionId){
        let ns = 'queries/getFromHistorianupdateasset';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistorianactivity(transactionId){
        let ns = 'queries/getFromHistorianactivity';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistorianph(transactionId){
        let ns = 'queries/getFromHistorianph';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistoriantransfer(transactionId){
        let ns = 'queries/getFromHistoriantransferpackage';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistorianmerge(transactionId){
        let ns = 'queries/getFromHistorianmergeasset';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }
    public getHistoriandivide(transactionId){
        let ns = 'queries/getFromHistoriandivideasset';
        let Id = transactionId;
        console.log(this.actionUrl+ns +'?' + 'Id='+ Id);
        return this.http.get(this.actionUrl +ns +'?' + 'Id='+ Id)
        .map(this.extractData)
        .catch(this.handleError);

    }

    public getSubmittedRequests(user){
        let ns = 'queries/getSubmittedRequests';
        console.log(this.actionUrl+ns +'?' + 'user='+ user);
        return this.http.get(this.actionUrl +ns +'?' + 'user='+ user)
        .map(this.extractData)
        .catch(this.handleError);

    }

    public getPendingRequests(user){
        let ns = 'queries/getPendingRequests';
        console.log(this.actionUrl+ns +'?' + 'user='+ user);
        return this.http.get(this.actionUrl +ns +'?' + 'user='+ user)
        .map(this.extractData)
        .catch(this.handleError);

    }

    public getOwnedProducts(user){
        let ns = 'queries/getOwnedProducts';
        console.log(this.actionUrl+ns +'?' + 'user='+ user);
        return this.http.get(this.actionUrl +ns +'?' + 'user='+ user)
        .map(this.extractData)
        .catch(this.handleError);

    }

    public divideAsset(asset){
        let ns = '/org.ucsc.agriblockchain.DivideAsset';
        return this.http.post(this.actionUrl + ns, asset)
          .map(this.extractData)
          .catch(this.handleError);

    }  
    
    public transferAsset(asset){
        let ns = '/org.ucsc.agriblockchain.TransferPackage';
        return this.http.post(this.actionUrl + ns, asset)
          .map(this.extractData)
          .catch(this.handleError);

    }  
 
}
