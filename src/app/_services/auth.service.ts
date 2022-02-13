import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { DriveService } from './drive.service';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
	public $loggedIn = new BehaviorSubject(false);
	public $role = new BehaviorSubject('Unconfigured');
  constructor(public aService: AuthService, public alService: AlertService, public dService: DriveService) {
		if (localStorage.getItem('eModAuthToken')) {
			this.$loggedIn.next(true);
		}
	}
	login(): void {
		this.aService.signIn(GoogleLoginProvider.PROVIDER_ID, {	offline_access: true }).then(h => {
			this.$loggedIn.next(true);
      localStorage.setItem('eModAuthToken', h.authToken);
			localStorage.setItem('eModEmail', h.email)
      this.alService.successThenNav('Welcome ' + h.name + '!', '/instructions');
    }).catch(err => this.alService.error(err));
	}
	logout(): void {
		this.aService.signOut(true).then(v => {
			this.$loggedIn.next(false);
			localStorage.removeItem('eModAuthToken');
			localStorage.removeItem('eModEmail');
			this.alService.successThenNav('Logged Out', '/login');
    }).catch(err => { console.log(err) });
	}
	refreshToken(): void {
	//	this.auth.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
	}
	initRole() {
		this.dService.getFiles().then((o) => {
			if (o.files.length > 0) {
				const config = o.files.find((k) => k.name === "config.eMod");
				if (config) {
					this.dService.getFile(config.id).then((p) => {
						this.$role.next(p.role);
					});
				}
			}
		});
	}
}
