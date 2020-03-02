import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DriveService } from './drive.service';
import { AlertService } from './alert.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private alert: AlertService, private drive: DriveService) { }
    canActivate(): boolean {
        if (this.drive.loggedIn()) {
            return true;
        }
        this.alert.errorThenNav('Not Logged In!', 'auth');
        return false;
    }
}
