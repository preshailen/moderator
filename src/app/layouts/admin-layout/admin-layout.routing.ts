import { Routes } from '@angular/router';

import { UserComponent } from '../../pages/user/user.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { AuthGuard } from 'app/_services/auth.guard';
import { AdminComponent } from 'app/pages/admin/admin.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'auth', component: AuthComponent},
    { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },



    { path: 'user', component: UserComponent },
    { path: 'icons', component: IconsComponent },

];
