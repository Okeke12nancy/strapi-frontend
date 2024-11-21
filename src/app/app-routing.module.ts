import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TrackOrderComponent } from './pages/track-order/track-order.component';
import { DriverLoginComponent } from './pages/driver-login/driver-login.component';
import { DriverRegisterComponent } from './pages/driver-register/driver-register.component';
import { DriverDashboardComponent } from './pages/driver-dashboard/driver-dashboard.component';
import { DriverComponent } from './pages/driver/driver.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'track',
    component: TrackOrderComponent,
  },
  {
    path: 'driver',
    component: DriverComponent,
    children: [
      {
        path: 'login',
        component: DriverLoginComponent,
      },
      {
        path: 'register',
        component: DriverRegisterComponent,
      },
      {
        path: 'dashboard',
        component: DriverDashboardComponent,
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
