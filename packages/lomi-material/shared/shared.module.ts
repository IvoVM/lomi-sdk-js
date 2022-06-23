import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { RoutingModule } from '../src/app/app-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../src/environments/environment';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { QuillModule } from 'ngx-quill'
import { DragNDropDirective } from '../directivess/drag-n-drop.directive';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { MenuComponent } from './components/menu/menu.component'
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    DragNDropDirective,
    MenuComponent
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
    
  ],
  exports: [
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
    MenuComponent
  ]
})
export class SharedModule { }
