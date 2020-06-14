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
  getPngOptions(): {} {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'image/png',
      'Accept': 'image/png',
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
  addSyncFile(name: string, body: {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', body, this.getOptions()).toPromise().then(c => {
        this.http.patch('https://www.googleapis.com/drive/v3/files/' + (c as any).id, { 'name': name }, this.getOptions()).toPromise().then(b => {
          resolve(b);
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }
  addFileBatch(batchName: string, files: File[], fileNames: string[], parentId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const _files = [];
      const _data = [];
      const data = [];
      const permissions = [];
      for (let f = 0; f < files.length; f++) {
        _files.push(this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', files[f], this.getPngOptions()).toPromise());
      }
      Promise.all(_files).then(c => {
        const permission = { 'role': 'writer', 'type': 'anyone' };
        for (let h = 0; h < c.length; h++) {
          _data.push(this.http.patch('https://www.googleapis.com/drive/v3/files/' + c[h].id + '?addParents=' + parentId + '&key=' + this.apiKey, { 'name': fileNames[h] }, this.getOptions()).toPromise());
          permissions.push(this.http.post('https://www.googleapis.com/drive/v3/files/' + c[h].id + '/permissions?key=' + this.apiKey, permission, this.getOptions()).toPromise());
        }
        Promise.all(_data).then(d => {
          for (let s = 0; s < d.length; s++) {
            data.push({
              id: d[s].id,
              name: d[s].name
            });
          }
          Promise.all(permissions).then(y => {
            this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', { data }, this.getOptions()).toPromise().then(l => {
              const name = batchName + '.moderate';
              this.http.patch('https://www.googleapis.com/drive/v3/files/' + (l as any).id + '?addParents=' + parentId, { 'name': name }, this.getOptions()).toPromise().then(q => {
                resolve(q);
                }).catch(err => reject(err));
              }).catch(err => reject(err));
            }).catch(err => reject(err));
          }).catch(err => console.log(err));
        }).catch(err => reject(err));
      });
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
