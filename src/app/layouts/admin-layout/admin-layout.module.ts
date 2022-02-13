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
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';

// My Services

import { TeacherGuard } from 'app/_services/teacher.guard';
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
    ViewComponent,
    FeedbackListComponent,
    ResourcesComponent,
    InstructionsComponent,
    ConfigureComponent,
		ViewFeedbackComponent,
		CreateBatchComponent,
		ModerateListComponent,
		LogoutComponent
  ], providers: [
    DataResolver,
    TeacherGuard,
    ViewResolver
  ]
})

export class AdminLayoutModule {}
