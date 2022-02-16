import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable()
export class PreventChanges implements CanDeactivate<CanComponentDeactivate> {
	  constructor(public alService: AlertService) {}
    canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
			return component.canDeactivate() ? true: this.alService.confirmPageExit();
		}
}
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}