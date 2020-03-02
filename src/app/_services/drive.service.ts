import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { File } from '../models/file.class';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  apiKey: string;
  options: {};
  constructor(private http: HttpClient) {
    this.apiKey = 'AIzaSyBVlg0RWo6AgOUoQ_w396_K2hJAZZNn8Js';
  }
  listFiles(): Promise<any> {
    this.options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      })
    };
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files?key=' + this.apiKey, this.options).toPromise();
  }
  addFile(name: string) {
    this.options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
        'Content-Type': 'application/json'
      })
    };
    // tslint:disable-next-line: max-line-length
    this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', { name: name }, this.options).toPromise().then(
      (val) => {
        console.log(val);
        // return this.http.post(url, file, this.options).toPromise();
      }
    );
  }
  loggedIn(): boolean {
    if (localStorage.getItem('authToken')) {
      return true;
    } else {
      return false;
    }
  }
}
