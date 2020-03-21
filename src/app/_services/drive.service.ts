import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  apiKey = 'AIzaSyBVlg0RWo6AgOUoQ_w396_K2hJAZZNn8Js';
  constructor(private http: HttpClient) { }
  getOptions(): {} {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return { headers };
  }
  getFiles(): Promise<any> {
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files?q=trashed=false&key=' + this.apiKey, this.getOptions()).toPromise();
  }
  getFileData(id: string): Promise<any> {
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files/' + id, this.getOptions()).toPromise();
  }
  getFile(id: string): Promise<any> {
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files/' + id + '?alt=media', this.getOptions()).toPromise();
  }
  getFolder(id: string): Promise<any> {
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files?q=' + JSON.stringify(id) + ' in parents&key=' + this.apiKey, this.getOptions()).toPromise();
  }
  addFile(name: string, body: {}): void {
    this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', body, this.getOptions()).toPromise().then(
      c => {
        return this.http.patch('https://www.googleapis.com/drive/v3/files/' + (c as any).id, { 'name': name }, this.getOptions()).toPromise();
      }
    );
  }
  addSubFile(name: string, body: {}, parentId: string): void {
    this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', body, this.getOptions()).toPromise().then(
      c => {
        return this.http.patch('https://www.googleapis.com/drive/v3/files/' + (c as any).id + '?addParents=' + parentId + '&key=' + this.apiKey, { 'name': name }, this.getOptions()).toPromise();
      }
    );
  }
  addFolder(name: string): Promise<{}> {
    const data = { 'mimeType': 'application/vnd.google-apps.folder', 'name': name };
    return this.http.post('https://www.googleapis.com/drive/v3/files?key=' + this.apiKey, data, this.getOptions()).toPromise();
  }
  addSubFolder(name: string, parentId: string) {
    const parents = [];
    parents.push(parentId);
    const data = { 'mimeType': 'application/vnd.google-apps.folder', 'name': name, 'parents': parents };
    return this.http.post('https://www.googleapis.com/drive/v3/files?key=' + this.apiKey, data, this.getOptions()).toPromise();
  }
  editFile(id: string, body: {}) {
    return this.http.patch('https://www.googleapis.com/drive/v3/files/' + id + '?key=' + this.apiKey, body, this.getOptions()).toPromise();
  }
  addPermission(fileId: string, emailAddress: string): Promise<{}> {
    const data = { 'role': 'writer', 'type': 'user', 'emailAddress': emailAddress };
    return this.http.post('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions?key' + this.apiKey, data, this.getOptions()).toPromise();
  }
  loggedIn(): boolean {
    if (localStorage.getItem('authToken')) {
      return true;
    } else {
      return false;
    }
  }
  checkFolder(id: string): Promise<boolean> {
    return this.http.get<boolean>('https://www.googleapis.com/drive/v3/files/' + id, this.getOptions()).toPromise();
  }
}
