import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retryBackoff } from 'backoff-rxjs';
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
  getFile(id: string): Promise<any> {
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files/' + id + '?alt=media', this.getOptions()).toPromise();
  }
  getFileMetadata(id: string) {
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files/' + id, this.getOptions()).toPromise();
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
  configureRemarks(): Promise<any>  {
    return new Promise((resolve, reject) => {
      const data = { 'mimeType': 'application/vnd.google-apps.folder', 'name': 'Preshailen' };
      this.http.post('https://www.googleapis.com/drive/v3/files?key=' + this.apiKey, data, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(c => {
        const permission = { 'role': 'writer', 'type': 'user', 'emailAddress': 'RuthnamPresh@gmail.com' };
        this.http.post('https://www.googleapis.com/drive/v3/files/' + (c as any).id + '/permissions?key' + this.apiKey, permission, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(q => {
          const body = {
            items: []
          };
          this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', body, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(m => {
            this.http.patch('https://www.googleapis.com/drive/v3/files/' + (m as any).id + '?addParents=' + (c as any).id, { 'name': 'remarks.json' }, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(k => {
              resolve(k);
            }, err => reject(err));
          }, err => reject(err));
        }, err => reject(err));
      }, err => reject(err));
    });
  }
  addFileAnnotation(id: string, body: File, name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch('https://www.googleapis.com/upload/drive/v3/files/' + id + '?uploadType=media&key=' + this.apiKey, body, this.getPngOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(c => {
        this.http.patch('https://www.googleapis.com/drive/v3/files/' + id + '?key=' + this.apiKey, { 'name': name }, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(t => {
          resolve(name);
        }, err => reject(err), () => {});
      }, err => reject(err), () => {});
    });
  }
  finishModerate(id: string, name: string, body: {}) {
    return new Promise((resolve, reject) => {
      this.http.patch('https://www.googleapis.com/upload/drive/v3/files/' + id + '?uploadType=media&key=' + this.apiKey, body, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(c => {
        this.http.patch('https://www.googleapis.com/drive/v3/files/' + id + '?key=' + this.apiKey, { 'name': name }, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(t => {
          resolve(name);
        }, err => reject(err), () => {});
      }, err => reject(err), () => {});
    });
  }
  addFileBatch(batchName: string, files: File[], fileNames: string[], parentId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const data = [];
      for (let f = 0; f < files.length; f++) {
        const result = new Promise((res, rej) => {
          this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', files[f], this.getPngOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(i => {
          this.http.patch('https://www.googleapis.com/drive/v3/files/' + (i as any).id + '?addParents=' + parentId + '&key=' + this.apiKey, { name: fileNames[f] }, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(b => {
            const permission = { role: 'writer', type: 'anyone' };
            this.http.post('https://www.googleapis.com/drive/v3/files/' + (i as any).id + '/permissions?key=' + this.apiKey, permission, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(l => {
              res({ id: (b as any).id, name: (b as any).name });
            }, erroneos => rej(erroneos), () => {});
          }, error => rej(error), () => {});
          }, err => rej(err), () => {});
        });
        await result.then(u => data.push(u)).catch(err => reject(err));
      }
      this.http.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', { data }, this.getOptions()).toPromise().then((l) => {
        const name = batchName + '.moderate';
        this.http.patch('https://www.googleapis.com/drive/v3/files/' + (l as any).id + '?addParents=' + parentId, { name: name }, this.getOptions()).toPromise().then((q) => {
          resolve(q);
        }).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });
  }
  addFolder(name: string): Promise<{}> {
    const data = { 'mimeType': 'application/vnd.google-apps.folder', 'name': name };
    return this.http.post('https://www.googleapis.com/drive/v3/files?key=' + this.apiKey, data, this.getOptions()).toPromise();
  }
  editFile(id: string, body: {}) {
    return this.http.patch('https://www.googleapis.com/upload/drive/v3/files/' + id + '?key=' + this.apiKey, body, this.getOptions()).toPromise();
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
  deleteFolder(id: string): Promise<any> {
    return this.http.delete('https://www.googleapis.com/drive/v3/files/' + id, this.getOptions()).toPromise();
  }
  deleteAll(id: string, ids: any[]) {
    const result = new Promise(async (resolve, reject) => {
      for (let r = 0; r < ids.length; r++) {
        this.http.delete('https://www.googleapis.com/drive/v3/files/' + ids[r], this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(i => {
        }, err => reject(err));
      }
      this.http.delete('https://www.googleapis.com/drive/v3/files/' + id, this.getOptions()).pipe(retryBackoff({ initialInterval: 100, maxRetries: 12, resetOnSuccess: true })).subscribe(i => {
        resolve(i);
      }, err => reject(err));
    });
    return result;
  }
}
