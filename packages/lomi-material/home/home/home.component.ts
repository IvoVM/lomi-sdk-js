import { Component, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { FirestoreService } from 'packages/lomi-material/src/providers/firestore.service';
import { Recipe } from 'packages/lomi-material/types/recipes';

@Component({
  selector: 'lomii-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public recipes:Array<Recipe> = [];
  
  constructor(
    private firestore:FirestoreService
  ) {
  }

  ngOnInit(): void {
    this.firestore.recipes$.subscribe((recipes:any)=>{
      this.recipes = recipes
    })
  }
}
