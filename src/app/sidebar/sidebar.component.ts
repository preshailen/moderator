import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/admin',     title: 'Admin', icon: 'nc-bank', class: '' },
    { path: '/auth', title: 'Authorization', icon: 'nc-lock-circle-open', class: '' },
    { path: ' ', title: ' ', icon: ' ', class: ' '},
    { path: '/icons', title: 'Icons', icon: 'nc-diamond',    class: '' }
];

@Component({
    moduleId: module.id,
    // tslint:disable-next-line: component-selector
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
