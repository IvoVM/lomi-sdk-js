import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from '../../home/components/recipe/recipe.component';
import { HomeComponent } from '../../home/home/home.component';
import { OrdersComponent } from '../../orders/home/orders.component';
import { OrderComponent } from '../../orders/components/recipe/order.component';
import { AuthGuard } from '../../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {path : '', redirectTo: '/dashboard', pathMatch: "full" },
      {path: 'dashboard', component: HomeComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'orders/:number', component: OrderComponent},
      {path: 'recipes', component: HomeComponent},
      {path: 'recipes/new', component: RecipeComponent},
      {path: 'recipes/:recipeTitle', component: RecipeComponent}
    ]
  }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }