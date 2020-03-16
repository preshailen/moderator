import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { DriveService } from './drive.service';
import { AlertService } from './alert.service';

@Injectable()

export class CreateResolver implements Resolve<any> {
    constructor( private as: AlertService, private ds: DriveService) { }
    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        return this.ds.checkFolder(route.params['id']).then(v => v).catch(err => this.as.errorThenNav('Folder Does not exist!', 'admin') );
    }
}
