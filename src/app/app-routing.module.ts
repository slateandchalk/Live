import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, hasCustomClaim, canActivate } from '@angular/fire/auth-guard';
import { LandingComponent } from './layouts/landing/landing.component';
import { HeadDashboardComponent } from './modules/head-dashboard/head-dashboard.component';
import { CreateDashboardComponent } from './modules/create-dashboard/create-dashboard.component';
import { ClientDashboardComponent } from './modules/client-dashboard/client-dashboard.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const headOnly = () => hasCustomClaim('head');

const routes: Routes = [
  {
    path: 'dashboard', component: DefaultComponent,
    children: [
      {
      path: '', component: ClientDashboardComponent, canActivate: [AngularFireAuthGuard]
      },
      {
        path: 'create-event', component: CreateDashboardComponent, canActivate: [AngularFireAuthGuard]
      },
      {
      path: 'head-approval', component: HeadDashboardComponent, ...canActivate(headOnly)
      }]
  },
  {
    path: '', component: LandingComponent, data: { authGuardPipe: redirectUnauthorizedToLogin },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
