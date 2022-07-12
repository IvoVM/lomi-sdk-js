import { Injectable } from '@angular/core';
import { collectionData, Firestore, onSnapshot, query } from '@angular/fire/firestore';
import { collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { LomiBox } from 'packages/lomi-material/types/lomiBox';
import { Recipe } from 'packages/lomi-material/types/recipes';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private recipesRef: CollectionReference;
  public recipes$: Observable<Recipe[]>;
  
  // public lomiBoxes$: Observable<LomiBox[]>;
  private lomiBoxRef: CollectionReference;
  lomiBoxes$ = new BehaviorSubject<any>([])

  constructor(
    private firestore:Firestore
    ) {
    this.recipesRef = collection(this.firestore, 'recetas-lomi');
    this.recipes$ = collectionData(this.recipesRef) as Observable<Recipe[]>

    this.lomiBoxRef = collection(this.firestore, 'lomi-box');
    const q = query(collection(this.firestore, 'lomi-box'))
    onSnapshot(q, (response => {
      let boxes: any = []
      response.forEach((doc) => {
        boxes.push({id: doc.id, ...doc.data()})
      })
      this.lomiBoxes$.next(boxes)
    }))
    // this.lomiBoxes$ = collectionData(this.lomiBoxRef) as Observable<LomiBox[]>
  }

}
