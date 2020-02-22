import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()

export class AuthGuard implements Resolve<any> {
    constructor( private router: Router) { }
    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        console.log(route.params);
        return null;
    }
}
