import { Component, OnDestroy, OnInit } from '@angular/core';
import { collectionData, collectionSnapshots, Firestore, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, collection, CollectionReference, DocumentData, DocumentSnapshot, query, setDoc } from 'firebase/firestore';
import { ProductsService } from 'packages/lomi-material/providers/lomi/products.service';
import { Recipe } from 'packages/lomi-material/types/recipes';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import 'firebase/firestore';

@Component({
  selector: 'lomii-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit, OnDestroy {

  private recipe$:any;
  public keyword: any = "";
  public products:any = {};
  public ingredients:any = []

  public recipe:Recipe = {
    title : "",
    description : "",
    img: "",
    ingredients: []
  };

  setTitle(event:any){
    console.log(event.target.value)
    this.recipe.title = event.target.value
    this.updateDocument()
  }

  setDescription(event:any){
    console.log(event.target.value)
    this.recipe.description = event.target.value
    this.updateDocument()
  }

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params:any)=>{
      const recipesRef = collection(this.firestore, 'recetas-lomi');

      this.unsubscribe()
      this.recipe$ = collectionData(query(recipesRef,where("title", "==", params.recipeTitle))) as Observable<Recipe[]>
      this.listenToRecipe()
      this.updateDocument();
    })
  }

  updateDocument(){
    const document = doc(this.firestore,'recetas-lomi/'+this.recipe.title)
    setDoc(document, this.recipe)
  }

  searchProducts(){
    this.productsService.searchProducts(this.keyword).then((res)=>{
      this.products = res
      this.products.data = this.products.data.filter((product:any)=>{
        return !this.ingredients.find((ingredient:any)=>ingredient.id == product.id)
      })
    })
  }

  addIngredient(ingredient:any){
    this.recipe.ingredients.push(ingredient)
    const index = this.products.data.findIndex((product:any)=>{
      return product.id == ingredient.id
    })
    this.products.data.splice(index,1)
    this.updateDocument();
    console.log(this.ingredients)
  }
  
  listenToRecipe(){
    this.recipe$.subscribe((recipes:Recipe[])=>{
      if(recipes.length){
        this.recipe = recipes[0]
        console.log(this.recipe)
      }
    })
  }

  unsubscribe(){
    if(this.recipe$?.unsubscribe){
      this.recipe$.unsubscribe()
    }
  }

  ngOnDestroy(){
    this.unsubscribe();
  }
}