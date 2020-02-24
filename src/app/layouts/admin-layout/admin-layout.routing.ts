import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { ExampleComponent } from 'app/pages/example/example.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { LoggedInGuard } from 'app/infrastructure/sessions/loggedInGuard';

export const AdminLayoutRoutes: Routes = [
    { path: 'auth', component: AuthComponent},
    { path: 'dashboard',   canActivate: [LoggedInGuard],     component: DashboardComponent },
    { path: 'user',       canActivate: [LoggedInGuard],      component: UserComponent },
    { path: 'table',   canActivate: [LoggedInGuard],         component: TableComponent },
    { path: 'icons',   canActivate: [LoggedInGuard],         component: IconsComponent },
    { path: 'maps',      canActivate: [LoggedInGuard],       component: MapsComponent },
    { path: 'notifications',  canActivate: [LoggedInGuard],  component: NotificationsComponent },
    { path: 'upgrade',     canActivate: [LoggedInGuard],     component: UpgradeComponent },
    { path: 'example', canActivate: [LoggedInGuard],  component: ExampleComponent }

];
