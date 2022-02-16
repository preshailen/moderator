// General
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';

// Imported Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastUiImageEditorModule } from 'ngx-tui-image-editor';

// My Components
import { InstructionsComponent } from 'app/pages/instructions/instructions.component';
import { ConfigureComponent } from 'app/pages/configure/configure.component';
import { FeedbackListComponent } from 'app/pages/feedback-list/feedback-list.component';
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { ModerateListComponent } from 'app/pages/moderate-list/moderate-list.component';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';
import { CreateBatchComponent } from 'app/pages/create-batch/create-batch.component';
import { LogoutComponent } from 'app/pages/logout/logout.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastUiImageEditorModule
  ],
  declarations: [
    DashboardComponent,
    IconsComponent,
    FeedbackComponent,
    ModerateComponent,
    FeedbackListComponent,
    InstructionsComponent,
    ConfigureComponent,
		CreateBatchComponent,
		ModerateListComponent,
		LogoutComponent
  ]
})

export class AdminLayoutModule {}
