import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'https://www.googleapis.com/drive/v3/';
  }
  listFiles(): Promise<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'files').toPromise();
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
