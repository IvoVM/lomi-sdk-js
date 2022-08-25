import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LomiPromotionsComponent } from './promotions/lomi-promotions.component'
import { environment } from '../environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { HomeModule } from '../../home/home.module';
@NgModule({
  declarations: [
    AppComponent, 
    NxWelcomeComponent,
    LomiPromotionsComponent,
  ],
  imports: [
    BrowserModule,
    HomeModule,
    provideFirebaseApp(() => initializeApp(
      environment.firebaseConfig
    )),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
