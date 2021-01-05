import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DriveService } from './drive.service';
import { AlertService } from './alert.service';

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(private alert: AlertService, private drive: DriveService) { }
  canActivate(): boolean {
    if (this.drive.loggedIn()) {
      if (localStorage.getItem('role') === 'Teacher') {
        return true;
      } else {
        this.alert.errorThenNav('Not A Teacher!', '/admin');
        return false;
      }
    } else {
      this.alert.errorThenNav('Not Logged In!', 'auth');
      return false;
    }
  }
}
