import { Routes } from '@angular/router';

import { IconsComponent } from '../../pages/icons/icons.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { AuthGuard } from 'app/_services/auth.guard';
import { AdminComponent } from 'app/pages/admin/admin.component';
import { CreateComponent } from 'app/pages/create/create.component';
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { CreateResolver } from 'app/_services/createResolver';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';
import { ModeratorsComponent } from 'app/pages/moderators/moderators.component';
import { TeacherGuard } from 'app/_services/teacher.guard';
import { ViewComponent } from 'app/pages/view/view.component';
import { ViewResolver } from 'app/_services/viewResolver';
import { FeedbackListComponent } from 'app/pages/feedback-list/feedback-list.component';
import { DataResolver } from 'app/_services/data.resolve';
import { RemarksComponent } from 'app/pages/remarks/remarks.component';
import { RemarksGuard } from 'app/_services/remarks.guard';
import { ResourcesComponent } from 'app/pages/resources/resources.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'auth', component: AuthComponent},
    { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },
    { path: 'moderators', canActivate: [TeacherGuard], component: ModeratorsComponent },
    { path: 'create/:id', canActivate: [AuthGuard], component: CreateComponent, resolve: { data: CreateResolver } },
    { path: 'view/:folder/:id', canActivate: [AuthGuard], component: ViewComponent, resolve: { data: DataResolver } },
    { path: 'feedback-list/:id', canActivate: [AuthGuard], component: FeedbackListComponent, resolve: { data: ViewResolver } },
    { path: 'icons', component: IconsComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'remarks', component: RemarksComponent, canActivate: [RemarksGuard] },
    { path: 'moderate/:id', canActivate: [AuthGuard], component: ModerateComponent, resolve: { data: DataResolver } },
    { path: 'feedback/:id', canActivate: [AuthGuard], component: FeedbackComponent, resolve: { data: DataResolver } }
];
