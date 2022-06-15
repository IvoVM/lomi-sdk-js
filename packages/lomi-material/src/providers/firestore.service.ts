import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { Recipe } from 'packages/lomi-material/types/recipes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  public recipes$: Observable<Recipe[]>;
  private recipesRef: CollectionReference;

  constructor(
    private firestore:Firestore
    ) {
    
    //Declarations 
    this.recipesRef = collection(this.firestore, 'recetas-lomi');
    this.recipes$ = collectionData(this.recipesRef) as Observable<Recipe[]>
  }

}
