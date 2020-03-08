import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/_services/alert.service';
import { environment } from 'environments/environment';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { DriveService } from 'app/_services/drive.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  user: any;
  loggedIn: boolean;
  constructor(private _as_: AuthService, public as: AlertService, public ds: DriveService) { }

  ngOnInit() {
      this.loggedIn = this.ds.loggedIn();
      if (!this.loggedIn) {
        this.logout();
      }
  }
  login(): void {
    this._as_.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      h => {
        localStorage.setItem('authToken', h.authToken);
        this.loggedIn = true;
      } ,
      err => console.log(err)
    ).catch(e => console.log(e));
  }
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('authToken');
    this._as_.signOut().catch(err => err);
  }
}
