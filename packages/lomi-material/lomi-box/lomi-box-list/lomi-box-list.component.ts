import { Component, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { FirestoreService } from 'packages/lomi-material/src/providers/firestore.service';
import { LomiBox } from 'packages/lomi-material/types/lomiBox';
import { Recipe } from 'packages/lomi-material/types/recipes';

@Component({
  selector: 'lomii-box-list',
  templateUrl: './lomi-box-list.component.html',
  styleUrls: ['./lomi-box-list.component.scss'],
})
export class LomiBoxListComponent implements OnInit {

  public lomiBoxes:Array<LomiBox> = [];
  
  constructor(
    private firestore:FirestoreService
  ) {
  }

  ngOnInit(): void {
    this.firestore.lomiBoxes$.subscribe((lomiBoxes:LomiBox[])=>{
      this.lomiBoxes = lomiBoxes
    })
  }
}
