import { Injectable, EventEmitter } from '@angular/core';
import { AppRepository } from '../repositories/app.repository';
const CLIENT_ID = '991734157670-5vj2she2npal2m9bv4vobd5btd8geps8.apps.googleusercontent.com';
const API_KEY = ' ';
const DISCOVERY_DOCS = ['dd'];
const SCOPES = 'https://www.googleapis.com/auth/drive';

@Injectable()
export class GapiSession {
  googleAuth: gapi.auth2.GoogleAuth;
  constructor(private appRepository: AppRepository) {}
  initClient() {
    return new Promise((resolve, reject) => {
      gapi.load('client: auth2', () => {
        return gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(() => {
          this.googleAuth = gapi.auth2.getAuthInstance();
          resolve();
        });
      });
    });
  }
  get isSignedIn(): boolean {
    return this.googleAuth.isSignedIn.get();
  }
  signIn() {
    return this.googleAuth.signIn({
      prompt: 'consent'
    }).then((googleUser: gapi.auth2.GoogleUser) => {
      this.appRepository.User.add(googleUser.getBasicProfile());
    });
  }
  signOut(): void {
    this.googleAuth.signOut();
  }
}
