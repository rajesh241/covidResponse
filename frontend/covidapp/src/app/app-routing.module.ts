import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { CovidHomeComponent } from "./covid/covid-home/covid-home.component";
import { CovidLocateComponent } from "./covid/covid-locate/covid-locate.component";
import { CovidNearbyComponent } from "./covid/covid-nearby/covid-nearby.component";
import { CovidSearchComponent } from "./covid/covid-search/covid-search.component";
import { CovidCreateComponent } from "./covid/covid-create/covid-create.component";
import { FormCreateComponent } from "./form-create/form-create.component";
import { ContextCreateComponent } from "./context/context-create/context-create.component";
import { ContextFilterComponent } from "./context/context-filter/context-filter.component";
import { ContextEditComponent } from "./context/context-edit/context-edit.component";
import { ContextMapComponent } from "./context/context-map/context-map.component";
import { AboutComponent } from "./about/about.component";
import { AvatarEditComponent } from "./avatar-edit/avatar-edit.component";
import { Oauth2callbackComponent } from './oauth2callback/oauth2callback.component';

import { EntitySearchComponent } from "./entity/entity-search/entity-search.component";

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

const routes: Routes = [
    {path : '', component : CovidSearchComponent},
    //{path : '', redirectTo: 'search', pathMatch:'full'},
    {path : 'locate', component : CovidLocateComponent},
    {path : 'nearby', component : CovidNearbyComponent},
    {path : 'search', component : EntitySearchComponent},
    {path : 'form-create', component : FormCreateComponent},
    {path : 'invite', component : InviteComponent},
    {path : 'list', component : ContextFilterComponent},
    {path : 'map', component : ContextMapComponent},
    {path : 'about', component : AboutComponent},
    {path : 'users', component : UserListComponent},
    {path : 'login', component : LoginComponent},
    {path : 'register', component : RegisterComponent},
    {path : 'regconfirm', component : RegisterConfirmComponent},
    {path : 'add/:form', component : ContextCreateComponent},
    {path : 'useredit/:id', component : UserEditComponent},
    {path : 'item/:id', component : ContextEditComponent},
    {path : 'useradd', component : UserAddComponent},
    {path : 'profile', component : ProfileEditComponent},
    {path : 'avatar', component : AvatarEditComponent},
    {path : 'pwdreset', component : PasswordresetComponent},
    {path : 'pwdresetconfirm', component : PasswordresetConfirmComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
