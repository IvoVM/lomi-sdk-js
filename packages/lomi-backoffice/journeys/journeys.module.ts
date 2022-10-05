import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneysComponent } from './journeys/journeys.component';
import { SharedModule } from '../shared/shared.module';
import { JourneyComponent } from './journey/journey.component';

@NgModule({
  declarations: [JourneysComponent, JourneyComponent],
  imports: [CommonModule, SharedModule],
})
export class JourneysModule {}
