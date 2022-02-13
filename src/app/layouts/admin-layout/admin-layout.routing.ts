import { Routes } from '@angular/router';

import { IconsComponent } from '../../pages/icons/icons.component';
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';
import { ViewComponent } from 'app/pages/view/view.component';
import { ViewResolver } from 'app/_services/viewResolver';
import { FeedbackListComponent } from 'app/pages/feedback-list/feedback-list.component';
import { DataResolver } from 'app/_services/data.resolve';
import { ResourcesComponent } from 'app/pages/resources/resources.component';
import { InstructionsComponent } from 'app/pages/instructions/instructions.component';
import { ConfigureComponent } from 'app/pages/configure/configure.component';
import { ViewFeedbackComponent } from 'app/pages/view-feedback/view-feedback.component';
import { CreateBatchComponent } from 'app/pages/create-batch/create-batch.component';
import { ModerateListComponent } from 'app/pages/moderate-list/moderate-list.component';
import { LogoutComponent } from 'app/pages/logout/logout.component';

export const AdminLayoutRoutes: Routes = [
	  { path: 'instructions', component: InstructionsComponent },
		{ path: 'configure', component: ConfigureComponent },
		{ path: 'create-batch', component: CreateBatchComponent },
		{ path: 'view-feedback', component: ViewFeedbackComponent },
    { path: 'view/:folder/:id', component: ViewComponent, resolve: { data: DataResolver } },
    { path: 'feedback-list/:id', component: FeedbackListComponent, resolve: { data: ViewResolver } },
    { path: 'icons', component: IconsComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'moderate/:id', component: ModerateComponent, resolve: { data: DataResolver } },
		{ path: 'moderator-list', component: ModerateListComponent },
    { path: 'feedback/:id', component: FeedbackComponent, resolve: { data: DataResolver } },
		{ path: 'logout', component: LogoutComponent }
];
