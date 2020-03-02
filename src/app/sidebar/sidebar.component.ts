import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/admin',     title: 'Admin', icon: 'nc-bank', class: '' },
    { path: '/files', title: 'Files', icon: 'nc-align-center', class: '' },
    { path: '/auth', title: 'Authorization', icon: 'nc-lock-circle-open', class: '' },
   /* { path: '/icons',         title: 'Icons',             icon: 'nc-diamond',    class: '' },
    { path: '/maps',          title: 'Maps',              icon: 'nc-pin-3',      class: '' },
    { path: '/notifications', title: 'Notifications',     icon: 'nc-bell-55',    class: '' },
    { path: '/user',          title: 'User Profile',      icon: 'nc-single-02',  class: '' },
    { path: '/table',         title: 'Table List',        icon: 'nc-tile-56',    class: '' },
    { path: '/example',         title: 'Example',        icon: 'nc-tile-56',    class: '' },*/
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
