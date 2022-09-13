import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastMileProvidersService {

  public lastMileProviders$ = new Observable();

  constructor(
    private afs: Firestore,

  ) {
    this.lastMileProviders$ =  docData(doc(collection(this.afs, 'backoffice-app'), "journeyProviders"));
  }
}
