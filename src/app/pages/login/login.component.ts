import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/_services/alert.service';
import { AuthorizationService } from 'app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private aService: AuthorizationService, public alService: AlertService) { }

  ngOnInit() {
		if (this.aService.$loggedIn.getValue() === true) {
			this.alService.navigate('/instructions');
		}
	}
	createAccount(): void {
		window.open('https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp');
	}
	login(): void {
		this.aService.login();
	}
}
