import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from '../../home/components/recipe/recipe.component';
import { HomeComponent } from '../../home/home/home.component';
import { OrdersComponent } from '../../orders/home/orders.component';
import { OrderComponent } from '../../orders/components/recipe/order.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { AuthComponent } from '../../shared/auth/auth.component';
import { LomiBoxListComponent } from 'packages/lomi-material/lomi-box/lomi-box-list/lomi-box-list.component';
import { LomiBoxComponent } from 'packages/lomi-material/lomi-box/components/lomi-box/lomi-box.component';

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {path: 'dashboard', component: HomeComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'orders/:number', component: OrderComponent},
      {path: 'recipes', component: HomeComponent},
      {path: 'recipes/new', component: RecipeComponent},
      {path: 'recipes/:recipeTitle', component: RecipeComponent},
      {path: 'lomi-box/:boxId', component: LomiBoxComponent},
      {path: 'lomi-box', component: LomiBoxListComponent},
      {path : '', redirectTo: '/dashboard', pathMatch: "full" },
    ]
  }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }