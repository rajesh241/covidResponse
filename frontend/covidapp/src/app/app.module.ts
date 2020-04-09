import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angular4-social-login';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { libtech } from '../libtech';

import { LoginComponent } from './user/login/login.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { RegisterComponent } from './user/register/register.component';
import { RegisterConfirmComponent } from './user/register-confirm/register-confirm.component';
import { PasswordresetComponent } from './user/passwordreset/passwordreset.component';
import { PasswordresetConfirmComponent } from './user/passwordreset-confirm/passwordreset-confirm.component';
import { InviteComponent } from './user/invite/invite.component';
import { ProfileEditComponent } from './user/profile-edit/profile-edit.component';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { DateFilterPipe } from './date-filter.pipe';
import { AvatarEditComponent } from './avatar-edit/avatar-edit.component';
import { TimeFilterPipe } from './time-filter.pipe';
import { PaginatorComponent } from './paginator/paginator.component';
import { Oauth2callbackComponent } from './oauth2callback/oauth2callback.component';
import { CovidCreateComponent } from './covid/covid-create/covid-create.component';
import { ContextCreateComponent } from './context/context-create/context-create.component';
import { ContextFilterComponent } from './context/context-filter/context-filter.component';
import { ContextMapComponent } from './context/context-map/context-map.component';
import { CovidHomeComponent } from './covid/covid-home/covid-home.component';
import { CovidNearbyComponent } from './covid/covid-nearby/covid-nearby.component';
import { CovidLocateComponent } from './covid/covid-locate/covid-locate.component';
import { CovidSearchComponent } from './covid/covid-search/covid-search.component';
import { ContextEditComponent } from './context/context-edit/context-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MatButtonModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from "@angular/material";
import { AboutComponent } from './about/about.component';

// Angular FormIO - https://github.com/formio/angular-formio
import { FormioModule } from 'angular-formio';
import { MarkerDialogComponent } from './entity/marker-dialog/marker-dialog.component';
import { EntitySearchComponent } from './entity/entity-search/entity-search.component';
import { FormCreateComponent } from './formio/form-create/form-create.component';
import { FormDisplayComponent } from './formio/form-display/form-display.component';
import { EntityCreateComponent } from './entity/entity-create/entity-create.component';

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
        CovidSearchComponent,
        ContextEditComponent,
        AboutComponent,
        MarkerDialogComponent,
        FormCreateComponent,
        EntitySearchComponent,
        FormDisplayComponent,
        EntityCreateComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        FormioModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
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
    bootstrap: [AppComponent],
    entryComponents: [
        MarkerDialogComponent,
        // FormCreateComponent
    ]
})
export class AppModule { }
