import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angular4-social-login';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { libtech } from '../libtech';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { RegisterComponent } from './register/register.component';
import { DateFilterPipe } from './date-filter.pipe';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AvatarEditComponent } from './avatar-edit/avatar-edit.component';
import { TimeFilterPipe } from './time-filter.pipe';
import { RegisterConfirmComponent } from './register-confirm/register-confirm.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { Oauth2callbackComponent } from './oauth2callback/oauth2callback.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { PasswordresetConfirmComponent } from './passwordreset-confirm/passwordreset-confirm.component';
import { InviteComponent } from './invite/invite.component';
import { UserAddComponent } from './user-add/user-add.component';
import { CovidCreateComponent } from './covid/covid-create/covid-create.component';
import { ContextCreateComponent } from './context/context-create/context-create.component';
import { ContextFilterComponent } from './context/context-filter/context-filter.component';
import { ContextMapComponent } from './context/context-map/context-map.component';
import { CovidHomeComponent } from './covid/covid-home/covid-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MatButtonModule } from '@angular/material';
//import { MatIconModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { CovidNearbyComponent } from './covid/covid-nearby/covid-nearby.component';
import { CovidLocateComponent } from './covid/covid-locate/covid-locate.component';

//const google_oauth_client_id:string = '849540517607-9alj6fb3hoo3lhrlml4upqkme070bo2f.apps.googleusercontent.com';

let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(libtech.GOOGLECLIENTID)
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ProfileEditComponent,
        DateFilterPipe,
        RegisterComponent,
        UserListComponent,
        UserEditComponent,
        TimeFilterPipe,
        RegisterConfirmComponent,
        AvatarEditComponent,
        PaginatorComponent,
        Oauth2callbackComponent,
        PasswordresetComponent,
        PasswordresetConfirmComponent,
        InviteComponent,
        UserAddComponent,
        CovidCreateComponent,
        ContextCreateComponent,
        ContextFilterComponent,
        ContextMapComponent,
        CovidHomeComponent,
        CovidNearbyComponent,
        CovidLocateComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: libtech.googleAPIKey,
            libraries: ['places']
        }),
        HttpClientModule,
        SocialLoginModule,
        BrowserAnimationsModule
    ],
    providers: [
        AuthService,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
