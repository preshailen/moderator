import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { GapiSession } from './gapi.session';
@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private gapiSession: GapiSession) {}

  canActivate() {
    const isLoggedin = this.gapiSession.isSignedIn;
    if (!isLoggedin) {
      this.router.navigate(['/auth']);
    }
    return isLoggedin;
  }
}
