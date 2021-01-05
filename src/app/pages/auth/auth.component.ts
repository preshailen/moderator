import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/_services/alert.service';
import { GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { DriveService } from 'app/_services/drive.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss', '../../shared/shared.scss']
})
export class AuthComponent implements OnInit {
  user: any;
  loggedIn: boolean;
  constructor(private auth: AuthService, public alert: AlertService, public drive: DriveService) { }

  ngOnInit() {
    this.loggedIn = this.drive.loggedIn();
    if (!this.loggedIn) {
      this.logout();
    }
  }
  login(): void {
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID).then(h => {
      if (h.email === 'ruthnampresh@gmail.com') {
        localStorage.setItem('backend', 'yes');
      } else {
        localStorage.setItem('backend', 'no');
      }
      localStorage.setItem('authToken', h.authToken);
      this.loggedIn = true;
      this.alert.successThenNav('Welcome ' + h.name + '!', '/admin');
    }).catch(err => err);
  }
  logout(): void {
    this.auth.signOut().then(v => {
      localStorage.removeItem('backend');
      localStorage.removeItem('role');
      localStorage.removeItem('authToken');
      localStorage.removeItem('configured');
      this.loggedIn = false;
      this.alert.success('Goodbye!');
    }).catch(err => err);
  }
}
