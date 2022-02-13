import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule} from './shared/navbar/navbar.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { GoogleLoginProvider, AuthServiceConfig, LoginOpt, SocialLoginModule } from 'angularx-social-login';
import { AuthGuard } from './_services/auth.guard';
import { DataResolver } from './_services/data.resolve';
import { TeacherGuard } from './_services/teacher.guard';
import { ViewResolver } from './_services/viewResolver';
import { AuthorizationService } from './_services/auth.service';

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
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    SidebarModule,
    NavbarModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [
    ErrorInterceptorProvider,
		AuthGuard,
    DataResolver,
    TeacherGuard,
    ViewResolver,
		AuthorizationService,
    { provide: AuthServiceConfig, useFactory: providConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
