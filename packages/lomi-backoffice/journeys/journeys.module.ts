import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneysComponent } from './journeys/journeys.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [JourneysComponent],
  imports: [CommonModule, SharedModule],
})
export class JourneysModule {}
