import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { CovidHomeComponent } from "./covid/covid-home/covid-home.component";
import { CovidCreateComponent } from "./covid/covid-create/covid-create.component";
import { ContextCreateComponent } from "./context/context-create/context-create.component";
import { ContextFilterComponent } from "./context/context-filter/context-filter.component";
import { ContextMapComponent } from "./context/context-map/context-map.component";
import { ApartmentListComponent } from "./apartment-list/apartment-list.component";
import { ApartmentMapComponent } from "./apartment-map/apartment-map.component";
import { ApartmentCreateComponent } from "./apartment-create/apartment-create.component";
import { ApartmentEditComponent } from "./apartment-edit/apartment-edit.component";
import { ApartmentViewComponent } from "./apartment-view/apartment-view.component";
import { ApartmentFilterComponent } from "./apartment-filter/apartment-filter.component";
import { UserListComponent } from "./user-list/user-list.component";
import { LoginComponent } from "./login/login.component";
import { UserEditComponent } from "./user-edit/user-edit.component";
import { UserAddComponent } from "./user-add/user-add.component";
import { AvatarEditComponent } from "./avatar-edit/avatar-edit.component";
import { ProfileEditComponent } from "./profile-edit/profile-edit.component";
import { RegisterComponent } from "./register/register.component";
import { RegisterConfirmComponent } from "./register-confirm/register-confirm.component";
import { PasswordresetComponent } from "./passwordreset/passwordreset.component";
import { PasswordresetConfirmComponent } from "./passwordreset-confirm/passwordreset-confirm.component";
import { InviteComponent } from "./invite/invite.component";
import { Oauth2callbackComponent } from './oauth2callback/oauth2callback.component';

const routes: Routes = [
  // {path : '', redirectTo: 'contexts', pathMatch:'full'},
  {path : '', component : CovidHomeComponent},
  {path : 'invite', component : InviteComponent},
  {path : 'apartments', component : ApartmentFilterComponent, canActivate: [AuthGuard]},
  {path : 'contexts', component : ContextFilterComponent, canActivate: [AuthGuard]},
  {path : 'map', component : ContextMapComponent},
  {path : 'users', component : UserListComponent},
  {path : 'login', component : LoginComponent},
  {path : 'register', component : RegisterComponent},
  {path : 'regconfirm', component : RegisterConfirmComponent},
  {path : 'add', component : ContextCreateComponent},
  {path : 'edit/:id', component : ApartmentEditComponent},
  {path : 'view/:id', component : ApartmentViewComponent},
  {path : 'useredit/:id', component : UserEditComponent},
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
