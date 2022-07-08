import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { LomiBox } from 'packages/lomi-material/types/lomiBox';
import { Recipe } from 'packages/lomi-material/types/recipes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private recipesRef: CollectionReference;
  public recipes$: Observable<Recipe[]>;
  
  public lomiBoxes$: Observable<LomiBox[]>;
  private lomiBoxRef: CollectionReference;


  constructor(
    private firestore:Firestore
    ) {
    this.recipesRef = collection(this.firestore, 'recetas-lomi');
    this.recipes$ = collectionData(this.recipesRef) as Observable<Recipe[]>

    this.lomiBoxRef = collection(this.firestore, 'lomi-box');
    this.lomiBoxes$ = collectionData(this.lomiBoxRef) as Observable<LomiBox[]>
  }

}
