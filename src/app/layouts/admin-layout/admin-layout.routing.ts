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
import { FilesComponent } from 'app/pages/files/files.component';
import { AuthGuard } from 'app/_services/auth.guard';
import { AdminComponent } from 'app/pages/admin/admin.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'auth', component: AuthComponent},
    { path: 'files', canActivate: [AuthGuard], component: FilesComponent },
    { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },



    { path: 'user', component: UserComponent },
    { path: 'table', component: TableComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    { path: 'example', component: ExampleComponent }

];
