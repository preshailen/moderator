import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { DriveService } from './drive.service';
import { AlertService } from './alert.service';

@Injectable()

export class ModerateResolver implements Resolve<any> {
    constructor( private as: AlertService, private ds: DriveService) { }
    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        return this.ds.getFile(route.params['id']).then(v => v).catch(err => this.as.errorThenNav('Batch Does not exist!', 'admin') );
    }
}
