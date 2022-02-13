import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'app/_services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public aService: AuthorizationService) { }

  ngOnInit() {
		this.aService.logout();
  }

}
