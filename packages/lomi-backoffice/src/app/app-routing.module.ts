import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from '../../orders/home/orders.component';
import { OrderComponent } from '../../orders/components/recipe/order.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { AuthComponent } from '../../shared/auth/auth.component';
import { UsersIndexComponent } from 'packages/lomi-backoffice/users/users-index/users-index.component';
import { SettingsComponent } from '../../settings/settings/settings.component';
import { OrdersHistoryComponent } from 'packages/lomi-backoffice/orders/history/history.component';
import { UserWithoutRolComponent } from 'packages/lomi-backoffice/users/user-without-rol/user-without-rol.component';
import { JourneysComponent } from 'packages/lomi-backoffice/journeys/journeys/journeys.component';
import { JourneyComponent } from 'packages/lomi-backoffice/journeys/journey/journey.component';
import { UserRolComponent } from 'packages/lomi-backoffice/settings/user-rol/user-rol.component';
import { StockItemsComponent } from 'packages/lomi-backoffice/stock/stock-items/stock-items.component';
import { ProductsListComponent } from 'packages/lomi-backoffice/ripley/products-list/products-list.component';
import { DashboardComponent } from 'packages/lomi-backoffice/shared/components/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'user-without-rol', component: UserWithoutRolComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders-history', component: OrdersHistoryComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:number', component: OrderComponent },
      { path: 'users', component: UsersIndexComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'journeys', component: JourneysComponent },
      { path: 'journeys/:id', component: JourneyComponent },
      { path: 'userRol/:rol', component: UserRolComponent },
      { path: 'stock', component: StockItemsComponent },
      { path: 'ripley', component: ProductsListComponent },
      { path: '', redirectTo: '/orders', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
