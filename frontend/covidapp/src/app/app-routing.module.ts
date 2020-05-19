import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { CovidHomeComponent } from "./covid/covid-home/covid-home.component";
import { CovidLocateComponent } from "./covid/covid-locate/covid-locate.component";
import { CovidNearbyComponent } from "./covid/covid-nearby/covid-nearby.component";
import { CovidSearchComponent } from "./covid/covid-search/covid-search.component";
import { CovidCreateComponent } from "./covid/covid-create/covid-create.component";
import { FormCreateComponent } from "./formio/form-create/form-create.component";
import { FormDisplayComponent } from './formio/form-display/form-display.component';
import { ContextCreateComponent } from "./context/context-create/context-create.component";
import { FormEditComponent } from "./formio/form-edit/form-edit.component";
import { ContextFilterComponent } from "./context/context-filter/context-filter.component";
import { ContextEditComponent } from "./context/context-edit/context-edit.component";
import { ContextMapComponent } from "./context/context-map/context-map.component";
import { AboutComponent } from "./about/about.component";
import { AvatarEditComponent } from "./avatar-edit/avatar-edit.component";
import { Oauth2callbackComponent } from './oauth2callback/oauth2callback.component';

import { DashboardComponent } from './entity/dashboard/dashboard.component';
import { EntitySearchComponent } from "./entity/entity-search/entity-search.component";
import { EntityCreateComponent } from "./entity/entity-create/entity-create.component";
import { EntityListComponent } from "./entity/entity-list/entity-list.component";
import { MyEntityListComponent } from "./entity/my-entity-list/my-entity-list.component";
import { EntityEditComponent } from "./entity/entity-edit/entity-edit.component";
import { EntityDetailComponent } from "./entity/entity-detail/entity-detail.component";
import { EntityUpdateComponent } from "./entity/entity-update/entity-update.component";
//import { EntityGridComponent } from './entity/entity-grid/entity-grid.component';
import { RequestsListComponent } from "./funding/requests-list/requests-list.component";

import { LoginComponent } from './user/login/login.component';
import { MatloginComponent } from './user/matlogin/matlogin.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserAddeditComponent } from './user/user-addedit/user-addedit.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { RegisterComponent } from './user/register/register.component';
import { RegisterConfirmComponent } from './user/register-confirm/register-confirm.component';
import { PasswordresetComponent } from './user/passwordreset/passwordreset.component';
import { PasswordresetConfirmComponent } from './user/passwordreset-confirm/passwordreset-confirm.component';
import { InviteComponent } from './user/invite/invite.component';
import { PrivacyComponent } from './user/privacy/privacy.component';
import { ProfileEditComponent } from './user/profile-edit/profile-edit.component';
import { GroupAddComponent } from './user/group-add/group-add.component';
import { SurveyComponent } from './formio/survey/survey.component';
import { HelpComponent } from './help/help.component';
import { FaqComponent } from './help/faq/faq.component';
import { GuideComponent } from './help/guide/guide.component';
import { TutorialComponent } from './help/tutorial/tutorial.component';
import { TeamListComponent } from './team/team-list/team-list.component';
import { RouteSearchComponent } from './transit/route-search/route-search.component';
import { OrgsListComponent } from './funding/orgs-list/orgs-list.component';

const routes: Routes = [
    {path : '', component : EntityListComponent, canActivate: [AuthGuard]},
    //{path : '', redirectTo: 'search', pathMatch:'full'},
    {path : 'dashboard', component : DashboardComponent, canActivate:[AuthGuard]},
//    {path : 'grid', component : EntityGridComponent, canActivate:[AuthGuard]},
    {path : 'locate', component : CovidLocateComponent, canActivate:[AuthGuard]},
    {path : 'privacy', component : PrivacyComponent},
    {path : 'nearby', component : CovidNearbyComponent, canActivate:[AuthGuard]},
    {path : 'search', component : EntitySearchComponent, canActivate:[AuthGuard]},
    {path : 'form-create', component : FormCreateComponent, canActivate:[AuthGuard]},
    {path : 'form-display', component : FormDisplayComponent, canActivate:[AuthGuard]},
    {path : 'form-edit', component : FormEditComponent, canActivate:[AuthGuard]},
    {path : 'invite', component : InviteComponent},
    {path : 'list', component : EntityListComponent, canActivate:[AuthGuard]},
    {path : 'request', component : RequestsListComponent, canActivate:[AuthGuard]},
    {path : 'fund', component : OrgsListComponent, canActivate:[AuthGuard]},
    {path : 'mylist', component : MyEntityListComponent, canActivate:[AuthGuard]},
    {path : 'map', component : ContextMapComponent, canActivate:[AuthGuard]},
    {path : 'about', component : AboutComponent},
//    {path : 'help', component : HelpComponent},
    {path : 'faq', component : FaqComponent},
    {path : 'guide', component : GuideComponent},
    {path : 'tutorial', component : TutorialComponent},
    {path : 'users', component : UserListComponent, canActivate:[AuthGuard]},
    {path : 'teams', component : TeamListComponent, canActivate:[AuthGuard]},
    {path : 'login1', component : LoginComponent},
    {path : 'login', component : MatloginComponent},
    {path : 'register', component : RegisterComponent},
    {path : 'regconfirm', component : RegisterConfirmComponent},
    {path : 'add/:form', component : EntityCreateComponent, canActivate:[AuthGuard]},
    {path : 'helpseekers', component : EntityCreateComponent, canActivate:[AuthGuard]},
    {path : 'supportnetwork', component : EntityCreateComponent, canActivate:[AuthGuard]},
    {path : 'useredit/:id', component : UserEditComponent, canActivate:[AuthGuard]},
    {path : 'update/:id', component : EntityUpdateComponent, canActivate:[AuthGuard]},
    {path : 'useraddedit/:id', component : UserAddeditComponent, canActivate:[AuthGuard]},
    {path : 'item/:id', component : EntityDetailComponent, canActivate:[AuthGuard]},
    {path : 'transit/:id', component : RouteSearchComponent, canActivate:[AuthGuard]},
    {path : 'useradd', component : UserAddComponent, canActivate:[AuthGuard]},
    {path : 'teamadd', component : GroupAddComponent, canActivate:[AuthGuard]},
    {path : 'profile', component : ProfileEditComponent, canActivate:[AuthGuard]},
    {path : 'avatar', component : AvatarEditComponent},
    {path : 'pwdreset', component : PasswordresetComponent},
    {path : 'pwdresetconfirm', component : PasswordresetConfirmComponent},
    {path : 'survey/:id', component : SurveyComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
