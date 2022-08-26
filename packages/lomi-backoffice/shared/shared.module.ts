import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RoutingModule } from '../src/app/app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../src/environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { QuillModule } from 'ngx-quill';
import { DragNDropDirective } from '../directivess/drag-n-drop.directive';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MenuComponent } from './components/menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthComponent } from './auth/auth.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { LineItemComponent } from './line-item/line-item.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/compat/analytics';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafePipe } from './pipes/safe-pipe';
import { UberStatusPipe } from './pipes/status-uber-pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { FiltersSideComponent } from './components/filters-side/filters-side.component';

@NgModule({
  declarations: [
    DragNDropDirective,
    MenuComponent,
    AuthComponent,
    LineItemComponent,
    SafePipe,
    UberStatusPipe,
    FiltersSideComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    RoutingModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    QuillModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatBadgeModule,
  ],
  exports: [
    MatCardModule,
    MatGridListModule,
    RoutingModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    FormsModule,
    MatDialogModule,
    QuillModule,
    DragNDropDirective,
    AngularFireStorageModule,
    MenuComponent,
    MatMenuModule,
    AuthComponent,
    MatSlideToggleModule,
    MatTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    LineItemComponent,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    MatRadioModule,
    MatExpansionModule,
    MatBadgeModule,
    SafePipe,
    UberStatusPipe,
    MatInputModule,
    FiltersSideComponent
  ],
  providers: [ScreenTrackingService, UserTrackingService],
})
export class SharedModule {}
