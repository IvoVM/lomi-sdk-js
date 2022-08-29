import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from '../../orders/home/orders.component';
import { OrderComponent } from '../../orders/components/recipe/order.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { AuthComponent } from '../../shared/auth/auth.component';
import { UsersIndexComponent } from 'packages/lomi-backoffice/users/users-index/users-index.component';

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {path: 'dashboard', component: OrdersComponent},
      { path: 'orders-history', component: OrdersComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'orders/:number', component: OrderComponent},
      {path: 'users', component: UsersIndexComponent},
      {path : '', redirectTo: '/orders', pathMatch: "full" },
    ]
  }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }