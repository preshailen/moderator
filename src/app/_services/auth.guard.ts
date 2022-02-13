import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AlertService } from './alert.service';
import { AuthorizationService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private alert: AlertService, public aService: AuthorizationService) { }
    canActivate(): boolean {
			if (this.aService.$loggedIn.getValue() === true) {
				return true;
			}
			this.alert.errorThenNav('Not Logged In!', 'login');
      return false;
    }
}
