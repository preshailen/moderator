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
import { GoogleLoginProvider, AuthServiceConfig, LoginOpt, SocialLoginModule } from 'angularx-social-login';
import { ToastUiImageEditorModule } from 'ngx-tui-image-editor';

// My Components
import { AdminComponent } from 'app/pages/admin/admin.component';
import { CreateComponent } from 'app/pages/create/create.component';
import { AuthComponent } from 'app/pages/auth/auth.component';
import { FeedbackComponent } from 'app/pages/feedback/feedback.component';
import { ModerateComponent } from 'app/pages/moderate/moderate.component';
import { ViewFeedbackComponent } from 'app/pages/view-feedback/view-feedback.component';

// My Services
import { AuthGuard } from 'app/_services/auth.guard';
import { CreateResolver } from 'app/_services/createResolver';
import { ModerateResolver } from 'app/_services/moderateResolver';

const googleLoginOptions: LoginOpt = {
  prompt: 'consent',
  scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly'
};
const config = new AuthServiceConfig([{
  id: GoogleLoginProvider.PROVIDER_ID,
  provider: new GoogleLoginProvider('991734157670-5vj2she2npal2m9bv4vobd5btd8geps8.apps.googleusercontent.com', googleLoginOptions)
}]);
export function providConfig() {
  return config;
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SocialLoginModule,
    ToastUiImageEditorModule
  ],
  declarations: [
    DashboardComponent,
    IconsComponent,
    AuthComponent,
    AdminComponent,
    CreateComponent,
    FeedbackComponent,
    ModerateComponent,
    ViewFeedbackComponent
  ], providers: [
    AuthGuard,
    CreateResolver,
    ModerateResolver,
    { provide: AuthServiceConfig, useFactory: providConfig }
  ],
  bootstrap: [AuthComponent]
})

export class AdminLayoutModule {}
