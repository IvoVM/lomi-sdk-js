import { Component, OnDestroy, OnInit } from '@angular/core';
import { collectionData, deleteDoc, Firestore, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, collection, query, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ProductsService } from 'packages/lomi-material/providers/lomi/products.service';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { environment } from '../../../src/environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LomiBox  } from '../../../types/lomiBox';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  //

  selectCategory = ''
  isNew = false
  lomiBoxForm: FormGroup;
  id = ''


  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private formBuilder: FormBuilder  
    ) {
    this.lomiBoxForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      images: ['1', []],
      products: ['', [Validators.required]],
      option_text: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params:any)=>{
      this.id = params.boxId
      const lomiBoxRef =  doc(this.firestore, 'lomi-box', this.id);
      if (params.boxId === 'new') this.isNew = true
      this.unsubscribe()
      this.box$ = await getDoc(lomiBoxRef)
      this.getBox()
    })
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
    const ingredientIndex = this.ingredients.findIndex((ingredientToFind: any)=>{
      return ingredientToFind.id == ingredient.id
    })
    this.ingredients.splice(ingredientIndex,1)
  }

  addIngredient(ingredient:any){
    ingredient.quantity = 1
    this.ingredients.push(ingredient)
    const index = this.products.data.findIndex((product:any)=>{
      return product.id == ingredient.id
    })
    this.products.data.splice(index,1)
  }
  
  getBox(){
      if(this.box$.id != 'new'){
        console.log(this.box$)
        this.id = this.id
        this.lomiBoxForm.setValue({
          title: this.box$.data().title,
          category: this.box$.data().category,
          images: this.box$.data().images,
          products: this.box$.data().products,
          option_text: this.box$.data().option_text
        })
        this.ingredients = this.box$.data().products
      }
  }

  
  async updateBox() {
    if (!this.lomiBoxForm.valid && this.ingredients.length <= 0) return
    this.lomiBoxForm.value.products = this.ingredients
    this.lomiBoxForm.value.images = []
    let newData = doc(this.firestore, 'lomi-box', this.id)
    await updateDoc(newData, {
      ...this.lomiBoxForm.value
    })
    this.router.navigate(['lomi-box'])
  }
  
  async createBox() {
    if (!this.lomiBoxForm.valid && this.ingredients.length <= 0) return
    this.lomiBoxForm.value.products = this.ingredients
    this.lomiBoxForm.value.images = []
    await setDoc(doc(this.firestore, 'lomi-box', this.lomiBoxForm.value.title), this.lomiBoxForm.value); 
    this.router.navigate(['lomi-box'])
  }
  
  async deleteItem(): Promise<any> {
    await deleteDoc(doc(this.firestore, 'lomi-box', this.id));
    this.router.navigate(['lomi-box'])
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
