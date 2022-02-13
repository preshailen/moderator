import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DriveService } from './drive.service';
import { AlertService } from './alert.service';

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(private alert: AlertService, private drive: DriveService) { }
  canActivate(): boolean {
    return true;
  }
}
