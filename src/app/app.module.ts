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
import { AuthorizationService } from './_services/auth.service';
import { DataResolver } from './_services/data.resolve';
import { PreventChanges } from './_services/prevent-changes.guard';

const googleLoginOptions: LoginOpt = {
  prompt: 'consent',
  scope: 'https://www.googleapis.com/auth/drive'
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
		AuthorizationService,
		DataResolver,
		PreventChanges,
    { provide: AuthServiceConfig, useFactory: providConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
