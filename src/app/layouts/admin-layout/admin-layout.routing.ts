import { Routes } from '@angular/router';
import { IconsComponent } from '../../pages/icons/icons.component';
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';
import { FeedbackListComponent } from 'app/pages/feedback-list/feedback-list.component';
import { InstructionsComponent } from 'app/pages/instructions/instructions.component';
import { ConfigureComponent } from 'app/pages/configure/configure.component';
import { CreateBatchComponent } from 'app/pages/create-batch/create-batch.component';
import { ModerateListComponent } from 'app/pages/moderate-list/moderate-list.component';
import { LogoutComponent } from 'app/pages/logout/logout.component';
import { PreventChanges } from 'app/_services/prevent-changes.guard';
import { DataResolver } from 'app/_services/data.resolve';
import { PermissionsErrorComponent } from 'app/pages/permissions-error/permissions-error.component';
import { CommentsComponent } from 'app/pages/comments/comments.component';

export const AdminLayoutRoutes: Routes = [
	  { path: 'instructions', component: InstructionsComponent },
		{ path: 'configure', component: ConfigureComponent, canDeactivate: [PreventChanges] },
		{ path: 'create-batch', component: CreateBatchComponent },
		{ path: 'moderator-list', component: ModerateListComponent },
		{ path: 'moderate/:id', component: ModerateComponent, canDeactivate: [PreventChanges], resolve: { data: DataResolver } },
		{ path: 'feedback-list', component: FeedbackListComponent },
		{ path: 'feedback/:id', component: FeedbackComponent, resolve: { data: DataResolver } },
		{ path: 'permissions-error', component: PermissionsErrorComponent },
		{ path: 'comments', component: CommentsComponent },
		{ path: 'icons', component: IconsComponent },
		{ path: 'logout', component: LogoutComponent }
];
