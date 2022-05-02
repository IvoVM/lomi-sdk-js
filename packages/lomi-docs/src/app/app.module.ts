import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LomiPromotionsComponent } from './promotions/lomi-promotions.component'

@NgModule({
  declarations: [
    AppComponent, 
    NxWelcomeComponent,
    LomiPromotionsComponent
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
