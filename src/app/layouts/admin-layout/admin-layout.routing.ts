import { Routes } from '@angular/router';

import { IconsComponent } from '../../pages/icons/icons.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { AuthGuard } from 'app/_services/auth.guard';
import { AdminComponent } from 'app/pages/admin/admin.component';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'auth', component: AuthComponent},
    { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'upload', canActivate: [AuthGuard], component: ModerateComponent }
];
