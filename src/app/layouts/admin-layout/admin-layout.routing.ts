import { Routes } from '@angular/router';

import { IconsComponent } from '../../pages/icons/icons.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { AuthGuard } from 'app/_services/auth.guard';
import { AdminComponent } from 'app/pages/admin/admin.component';
import { CreateComponent } from 'app/pages/create/create.component';
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { CreateResolver } from 'app/_services/createResolver';
export const AdminLayoutRoutes: Routes = [
    { path: 'auth', component: AuthComponent},
    { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },
    { path: 'create/:id', canActivate: [AuthGuard], component: CreateComponent, resolve: {data: CreateResolver } },
    { path: 'view/:id', canActivate: [AuthGuard], component: FeedbackComponent },
    { path: 'icons', component: IconsComponent }
];
