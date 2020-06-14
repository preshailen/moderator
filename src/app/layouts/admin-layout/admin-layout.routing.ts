import { Routes } from '@angular/router';

import { IconsComponent } from '../../pages/icons/icons.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { AuthGuard } from 'app/_services/auth.guard';
import { AdminComponent } from 'app/pages/admin/admin.component';
import { CreateComponent } from 'app/pages/create/create.component';
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { CreateResolver } from 'app/_services/createResolver';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';
import { ViewFeedbackComponent } from 'app/pages/view-feedback/view-feedback.component';
import { ModerateResolver } from 'app/_services/moderateResolver';
export const AdminLayoutRoutes: Routes = [
    { path: 'auth', component: AuthComponent},
    { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },
    { path: 'create/:id', canActivate: [AuthGuard], component: CreateComponent, resolve: { data: CreateResolver } },
    { path: 'view/:id', canActivate: [AuthGuard], component: ViewFeedbackComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'moderate/:id', canActivate: [AuthGuard], component: ModerateComponent, resolve: { data: ModerateResolver } },
    { path: 'feedback/:id', canActivate: [AuthGuard], component: FeedbackComponent }
];
