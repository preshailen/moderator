import { NgModule } from '@angular/core';
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

import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
const googleLoginOptions = {
  prompt: 'consent',
  scope: 'https://www.googleapis.com/auth/drive'
};
const config = new AuthServiceConfig([{
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('991734157670-5vj2she2npal2m9bv4vobd5btd8geps8.apps.googleusercontent.com', googleLoginOptions)
}]);
export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SocialLoginModule
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
    AuthGuard,
    { provide: AuthServiceConfig, useFactory: provideConfig }
  ],
  bootstrap: [AuthComponent]
})

export class AdminLayoutModule {}
