import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DriverDashboardComponent } from './pages/driver-dashboard/driver-dashboard.component';
import { DriverLoginComponent } from './pages/driver-login/driver-login.component';
import { DriverRegisterComponent } from './pages/driver-register/driver-register.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TrackOrderComponent } from './pages/track-order/track-order.component';
import { DriverComponent } from './pages/driver/driver.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    DriverDashboardComponent,
    DriverLoginComponent,
    DriverRegisterComponent,
    LandingPageComponent,
    TrackOrderComponent,
    DriverComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    LucideAngularModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
