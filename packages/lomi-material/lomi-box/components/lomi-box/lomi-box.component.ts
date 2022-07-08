import { Component, OnDestroy, OnInit } from '@angular/core';
import { collectionData, collectionSnapshots, Firestore, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, collection, CollectionReference, DocumentData, DocumentSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';
import { ProductsService } from 'packages/lomi-material/providers/lomi/products.service';
import { Recipe } from 'packages/lomi-material/types/recipes';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { environment } from '../../../src/environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LomiBox  } from '../../../types/lomiBox';
const firebaseApp = initializeApp(environment.firebase);
const storage = getStorage(firebaseApp);

@Component({
  selector: 'lomii-box',
  templateUrl: './lomi-box.component.html',
  styleUrls: ['./lomi-box.component.scss'],
})
export class LomiBoxComponent implements OnInit, OnDestroy {

  private box$:any;
  public keyword: any = "";
  public products:any = {};
  public ingredients:any = []
  public editingDescription:boolean = false;

  //Just while developing
  public images:any = []
  //

  public lomiBox:LomiBox = {
    title : "",
    description : "",
    img: "",
    ingredients: [],
    images: []
  };

  setTitle(event:any){
    console.log(event.target.value)
    this.lomiBox.title = event.target.value
    this.updateDocument()
  }

  setDescription(event:any){
    console.log(event.target.value)
    this.lomiBox.description = event.target.value
    this.updateDocument()
  }

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private angularFireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params:any)=>{
      const lomiBoxRef = collection(this.firestore, 'lomi-box');

      this.unsubscribe()
      this.box$ = collectionData(query(lomiBoxRef,where("title", "==", params.lomiBoxTitle))) as Observable<LomiBox[]>
      this.listenToRecipe()
      this.updateDocument();
    })
  }

  onImageDropped(event:any){
    for (const file of event){
      this.images.push(file)
      const filePath = "lomi-box/"+this.lomiBox.title + "-" + this.images.length 
      const fileRef = this.angularFireStorage.ref(filePath)
      const  task = fileRef.put(file)
      task.then((taskSnapshot)=>{
        console.log(taskSnapshot.metadata)
        console.log(fileRef.getDownloadURL().subscribe((url)=>{
          this.lomiBox.images ? this.lomiBox.images.push(url) : this.lomiBox.images = [url]
          this.updateDocument()
        }))
      })
    }
  }

  updateDocument(){
    const document = doc(this.firestore,'lomi-box/'+this.lomiBox.title)
    setDoc(document, this.lomiBox)
  }

  searchProducts(){
    this.productsService.searchProducts(this.keyword).then((res)=>{
      this.products = res
      this.products.data = this.products.data.filter((product:any)=>{
        return !this.ingredients.find((ingredient:any)=>ingredient.id == product.id)
      })
    })
  }

  deleteIngredient(ingredient:any){
    const ingredientIndex = this.lomiBox.ingredients.findIndex((ingredientToFind)=>{
      return ingredientToFind.id == ingredient.id
    })
    this.lomiBox.ingredients.splice(ingredientIndex,1)
    this.updateDocument()
  }

  addIngredient(ingredient:any){
    ingredient.quantity = 1
    this.lomiBox.ingredients.push(ingredient)
    const index = this.products.data.findIndex((product:any)=>{
      return product.id == ingredient.id
    })
    this.products.data.splice(index,1)
    this.updateDocument();
    console.log(this.ingredients)
  }
  
  listenToRecipe(){
    this.box$.subscribe((boxes:LomiBox[])=>{
      if(boxes.length){
        this.lomiBox = boxes[0]
        console.log(this.lomiBox)
      }
    })
  }

  unsubscribe(){
    if(this.box$?.unsubscribe){
      this.box$.unsubscribe()
    }
  }

  ngOnDestroy(){
    this.unsubscribe();
  }
}
