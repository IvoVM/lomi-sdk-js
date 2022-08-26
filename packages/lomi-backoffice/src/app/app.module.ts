import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../../shared/shared.module';
import { OrdersModule } from '../../orders/orders.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { HttpClientModule } from '@angular/common/http';
import { reducers } from 'packages/lomi-backoffice/ngrx';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers } from 'packages/lomi-backoffice/ngrx';
import { OrderEffects } from '../../ngrx/effects/orders.effects';
import { MainHeaderComponent } from './main-header/main-header.component';
import { UserEffects } from 'packages/lomi-backoffice/ngrx/effects/user.effects';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, MainHeaderComponent],
  imports: [
    BrowserModule,
    MatToolbarModule,
    HttpClientModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([OrderEffects, UserEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    OrdersModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
