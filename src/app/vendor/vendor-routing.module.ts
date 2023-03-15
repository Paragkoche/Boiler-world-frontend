import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailComponent } from '../exhibitor/order-detail/order-detail.component';
import { AddProductComponent } from './add-product/add-product.component';
import { BecomeASponserComponent } from './become-a-sponser/become-a-sponser.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditStatusComponent } from './edit-status/edit-status.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { VendorComponent } from './vendor.component';

const routes: Routes = [
  {
    path : '',
    component: VendorComponent,
    children : [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path : 'add-product',
        component : AddProductComponent
      },
      {
        path: 'become-a-sponsor',
        component: BecomeASponserComponent
      },
      {
        path : 'product-list',
        component : ProductListComponent
      },
      {
        path : 'productEdit/:id',
        component : EditVendorComponent
      },
      {
        path : 'orderList',
        component : OrderListComponent
      },
      {
        path : 'invoice',
        component : InvoiceComponent
      },
      {
        path : 'edit-status/:id',
        component : EditStatusComponent
      },
      {
        path : 'orderDetails',
        component : OrderDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
