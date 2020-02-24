import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { File } from '../models/file.class';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  baseUrl: string;
  apiKey: string;
  options: {};
  constructor(private http: HttpClient) {
    this.baseUrl = 'https://www.googleapis.com/drive/v3/';
    this.apiKey = 'AIzaSyBVlg0RWo6AgOUoQ_w396_K2hJAZZNn8Js';
  }
  listFiles(): Promise<any> {
    this.options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      })
    };
    return this.http.get<any>(this.baseUrl + 'files?key=' + this.apiKey, this.options).toPromise();
  }
  loggedIn(): boolean {
    if (localStorage.getItem('auth') && localStorage.getItem('auth').toString() === 'auth') {
      return true;
    } else {
      return false;
    }
  }
  /*addPartners(model: Partner[]): Promise<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'addRedemptionPartners/' + localStorage.getItem('merchantNo'), model).toPromise();
  }
  addPartner(model: Partner): Promise<Partner> {
    model.merchantno = localStorage.getItem('merchantNo');
    return this.http.post<Partner>(this.baseUrl + 'addRedemptionPartner', model).toPromise();
  }
  editPartner(model: Partner): Promise<boolean> {
    model.merchantno = localStorage.getItem('merchantNo');
    return this.http.put<boolean>(this.baseUrl + 'editPartner', model).map(res => res).toPromise();
  }
  deletePartner(id: number): Promise<boolean> {
    return this.http.delete<boolean>(this.baseUrl + 'deletePartner/' + localStorage.getItem('merchantNo') + '/' + id).map(res => res).toPromise();
  }*/

}
