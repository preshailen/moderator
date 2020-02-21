import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'app/_services/alert.service';
import { AuthService, GoogleLoginProvider } from 'angular4-social-login';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  user: any;
  constructor(public as: AlertService, private _as: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
  login(platform: string) {
    platform = GoogleLoginProvider.PROVIDER_ID;
    this._as.signIn(platform).then(p => { console.log(p); this.user = p; });

  }
  signOut()
  {
    this._as.signOut();
  }

}
