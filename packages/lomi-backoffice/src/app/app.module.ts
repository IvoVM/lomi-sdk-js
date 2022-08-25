import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../../shared/shared.module';
import { OrdersModule } from '../../orders/orders.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { HttpClientModule } from '@angular/common/http';
import { reducers } from 'packages/lomi-backoffice/ngrx';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers } from 'packages/lomi-backoffice/ngrx';
import { OrderEffects } from '../../ngrx/effects/orders.effects';
import { PickresModule } from 'packages/lomi-backoffice/pickers/pickres.module';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    MatToolbarModule,
    HttpClientModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([OrderEffects ]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    OrdersModule,
    PickresModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
