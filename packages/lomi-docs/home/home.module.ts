import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { PreviewComponent } from './preview/preview.component';
import { DocsComponent } from './docs/docs.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    WelcomeComponent,
    PreviewComponent,
    DocsComponent,
    HomeComponent,
  ],
  imports: [CommonModule],
  exports: [
    WelcomeComponent,
    PreviewComponent,
    DocsComponent,
    HomeComponent,
  ]
})
export class HomeModule {}
