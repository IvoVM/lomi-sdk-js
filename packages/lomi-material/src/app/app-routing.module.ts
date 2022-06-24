import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from 'packages/lomi-material/home/components/recipe/recipe.component';
import { HomeComponent } from 'packages/lomi-material/home/home/home.component';
import { OrderComponent } from 'packages/lomi-material/orders/components/recipe/order.component';
import { OrdersComponent } from 'packages/lomi-material/orders/home/orders.component';

const routes: Routes = [
  {path : '', redirectTo: '/dashboard', pathMatch: "full" },
  {path: 'dashboard', component: HomeComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'orders/:number', component: OrderComponent},
  {path: 'recipes', component: HomeComponent},
  {path: 'recipes/new', component: RecipeComponent},
  {path: 'recipes/:recipeTitle', component: RecipeComponent}
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }