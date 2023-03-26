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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StatusPipe } from './pipes/status.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmModalComponent } from './components/modals/confirm-modal/confirm-modal.component';
import { HalfCardComponent } from './half-card/half-card.component';
import { FirebaseTableComponent } from './firebase-table/firebase-table.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { EditAddressComponent } from './modals/edit-address/edit-address.component';
import { PersistentNotificationComponent } from './components/persistent-notification/persistent-notification.component';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { EditStoreComponent } from './modals/edit-store/edit-store.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgAisModule } from 'angular-instantsearch';
import { StoreChangeComponent } from './components/store-change/store-change.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    DragNDropDirective,
    MenuComponent,
    AuthComponent,
    LineItemComponent,
    SafePipe,
    UberStatusPipe,
    FiltersSideComponent,
    StatusPipe,
    ConfirmModalComponent,
    HalfCardComponent,
    FirebaseTableComponent,
    EditAddressComponent,
    PersistentNotificationComponent,
    EditStoreComponent,
    StoreChangeComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: environment.gMapsKey,
    }),
    AgmDirectionModule,
    MatSnackBarModule,
    NgAisModule.forRoot(),
    ScrollingModule,
    MatChipsModule
  ],
  exports: [
    MatCardModule,
    AgmCoreModule,
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
    FiltersSideComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatProgressBarModule,
    StatusPipe,
    MatPaginatorModule,
    HalfCardComponent,
    FirebaseTableComponent,
    MatAutocompleteModule,
    AgmDirectionModule,
    PersistentNotificationComponent,
    MatSnackBarModule,
    MatTooltipModule,
    NgAisModule,
    StoreChangeComponent,
    ScrollingModule,
    MatChipsModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    ScreenTrackingService,
    UserTrackingService,
    GoogleMapsAPIWrapper,
  ],
})
export class SharedModule {}
