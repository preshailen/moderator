import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'app/_services/auth.service';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
		role: string;
}

export const ROUTES: RouteInfo[] = [
	  { path: '/instructions', title: 'Instructions', icon: 'nc-paper', class: '', role: 'Unconfigured' },
		{ path: '/configure', title: 'Configure', icon: 'nc-settings-gear-65', class: '', role: 'Unconfigured' },
		{ path: '/create-batch', title: 'Create Batch', icon: 'nc-cloud-upload-94', class: '', role: 'Teacher' },
		{ path: '/feedback-list', title: 'View Feedback', icon: 'nc-glasses-2', class: '', role: 'Teacher' },
    { path: '/moderator-list', title: 'Moderate', icon: 'nc-ruler-pencil', class: '', role: 'Moderator' },
    // { path: '/icons', title: 'Icons', icon: 'nc-diamond', class: ' ', role: 'Unconfigured' },
    { path: '/rt', title: '', icon: '', class: '', role: 'Unconfigured' },
		{ path: '/rt', title: '', icon: '', class: '', role: 'Unconfigured' },
		{ path: '/logout', title: 'Logout', icon: 'nc-button-power', class: '', role: 'Unconfigured' },
];

@Component({
    moduleId: module.id,
    // tslint:disable-next-line: component-selector
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
		constructor(public aService: AuthorizationService) { }
    ngOnInit() {
			this.aService.initRole();
			this.aService.$role.subscribe(p => {
				if (p === 'Unconfigured') {
					this.menuItems = ROUTES.filter(menuItem => menuItem.role === 'Unconfigured');
				} else if (p === 'Teacher') {
					this.menuItems = ROUTES.filter(menuItem => menuItem.role === 'Unconfigured' || menuItem.role === 'Teacher')
				} else if (p === 'Moderator') {
					this.menuItems = ROUTES.filter(menuItem => menuItem.role === 'Unconfigured' || menuItem.role === 'Moderator')
				}
			})
    }
}
