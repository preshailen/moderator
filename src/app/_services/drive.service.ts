import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  addConfig(name: string, role: string): void {
    this.options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
        'Content-Type': 'application/json'
      })
    };
    this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', { 'role': role } , this.options).toPromise().then(
      c => {
        this.http.patch('https://www.googleapis.com/drive/v3/files/' + (c as any).id, { 'name': name }, this.options).toPromise().then(
          v => console.log(v)
        );
      }
    );
  }
  getFile(id: string): Promise<any> {
    this.options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      })
    };
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files/' + id + '?alt=media', this.options).toPromise();
  }
  loggedIn(): boolean {
    if (localStorage.getItem('authToken')) {
      return true;
    } else {
      return false;
    }
  }
  checkUsername(name: string) {
    this.options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };
    return this.http.get('https://app.verify-email.org/api/v1/jSiF60tq0lnoEgl8CLXNKfwY6irCECvHIWKEIzLtN8WPl8WhC9/verify/' + name, this.options).toPromise().then(
      v => console.log(v),
      err => console.log(err)
    );
  }
}
