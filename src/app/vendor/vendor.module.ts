import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';


import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { OrderListComponent } from './order-list/order-list.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { EditStatusComponent } from './edit-status/edit-status.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { MatCardModule } from '@angular/material/card';
import { BecomeASponserComponent } from './become-a-sponser/become-a-sponser.component';


@NgModule({
  declarations: [
    VendorComponent,
    ProductListComponent,
    AddProductComponent,
    EditVendorComponent,
    OrderListComponent,
    InvoiceComponent,
    EditStatusComponent,
    DashboardComponent,
    OrderDetailsComponent,
    BecomeASponserComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDividerModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
    MatToolbarModule,
    MatCardModule
  ]
})
export class VendorModule { }
