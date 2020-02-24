import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExampleComponent } from 'app/pages/example/example.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { AuthGuard } from 'app/_guards/auth.guard';
import { GapiSession } from 'app/infrastructure/sessions/gapi.session';
import { LoggedInGuard } from 'app/infrastructure/sessions/loggedInGuard';
import { AppContext } from 'app/infrastructure/app.context';
import { AppSession } from 'app/infrastructure/sessions/app.session';
import { FileSession } from 'app/infrastructure/sessions/file.session';
import { UserSession } from 'app/infrastructure/sessions/user.session';
import { AppRepository } from 'app/infrastructure/repositories/app.repository';
import { BreadCrumbSession } from 'app/infrastructure/sessions/breadcrumb.session';
import { FileRepository } from 'app/infrastructure/repositories/file.repository';
import { UserRepository } from 'app/infrastructure/repositories/user.repository';

export function initGapi(gapiSession: GapiSession) {
  return () => gapiSession.initClient();
}



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    IconsComponent,
    AuthComponent,
    MapsComponent,
    NotificationsComponent,
    ExampleComponent
  ], providers: [
    LoggedInGuard,
    { provide: APP_INITIALIZER, useFactory: initGapi, deps: [GapiSession], multi: true},
    AppContext,
    AppSession,
    FileSession,
    GapiSession,
    UserSession,
    AppRepository,
    BreadCrumbSession,
    FileRepository,
    UserRepository

  ],
  bootstrap: [AuthComponent]
})

export class AdminLayoutModule {}
