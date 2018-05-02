import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import {FormsModule} from '@angular/forms';
import {AccountService} from './services/account.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {PatientsService} from './services/patients.service';
import { PatientComponent } from './patient/patient.component';
import {JournalService} from './services/journal.service';
import {AuthGuardService} from './services/auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PatientComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AccountService,
    PatientsService,
    JournalService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
