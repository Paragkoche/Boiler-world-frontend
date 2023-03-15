import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceComponent } from '../invoice/invoice.component';
import { EditVendorComponent } from '../edit-vendor/edit-vendor.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'exhibitor',
    'createdAt',
    'gst',
    'sub_total',
    'status',
    'detail',
  ];

  dataOrder = new MatTableDataSource();
  readonly: boolean;
  submited: boolean;
  loading: boolean = false;
  orderId: any;
  orderForm: any;
  statusForm: any;
  isLoadingResults: boolean = false;
  // dataOrder: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  openDialog(id: any) {
    //   this.dialog.open(OrderDetailsComponent);

    const dialogRef = this.dialog.open(
      // width: '250',
      OrderDetailsComponent,
      {
        data: id,
        width: '70%',
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  constructor(
    private _http: HttpService,
    private _sb: SnackBarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDataList();
  }
  totalPages: any;
  q: string = 'vendor/order/getAllOrder';
  limit: number = 10;
  page: number = 0;
  query: string = '';
  status: string = '';
  order: string = 'desc';
  pageSizeOptions: number[] = [5, 10, 25, 100];
  async getDataList(index = 4) {
    this._sb.loading('Loading Orders!');
    this.loading = false;
    this.isLoadingResults = true;

    // Page manipulation
    if (index == 9) {
      if (this.page > 1) this.page--;
      else return;
    }

    if (index == 10) this.page++;
    else this.q = this.q;

    (
      await this._http.get(
        `/${this.q}?page=${this.page}&limit=${this.limit}&query=${this.query}&order=${this.order}&status=${this.status}`
      )
    ).subscribe(
      (res: any) => {
        this._sb.close();

        this.loading = false;
        console.log(res);
        // this.isLoadingResults = false;
        if (res.status) {
          this._sb.success('Order Loaded');
          this.totalPages = res.data.totalItems;
          this.dataOrder = res.data.rows;
          setTimeout(() => {
            this.paginator.pageIndex = this.page;
            this.paginator.length = res.data.totalItems;
          });
          this.dataOrder.paginator = this.paginator;
        } else {
          this._sb.error('Order Load Failed');
          // this._sb.openSnackBar(res.message, 'OK', 3000)
        }
      },
      (err) => {
        this._sb.error('Order Load Failed');
        this.loading = false;
        // this.isLoadingResults = false;
        this._http.handleError(err);
      }
    );
  }

  async getOrder() {
    // get all request for branch
    //  console.log('data');
    (await this._http.get('/vendor/order/getAllOrder')).subscribe(
      (res: any) => {
        console.log(res);
        this.loading = false;
        this.dataOrder = res.data.rows;
        // console.log('data');
      }
    );
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.limit = event.pageSize;
    this.page = event.pageIndex;
    this.getDataList();
  }

  // update

  confirmEdit() {
    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: '#f12711',
      background: '#319447',
      // color: '#FFFFFF',
      confirmButtonColor: '#2B8797',
      cancelButtonColor: '#f5af19',
      showCancelButton: true,
      confirmButtonText: 'Yes, Edit it!',
      cancelButtonText: 'No, Cancel!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.statusForm.enable();
        this.readonly = !this.readonly;
      }
    });
  }

  async update(orderId: any, status: any) {
    this.submited = true;
    this.loading = true;
    (
      await this._http.put(`/vendor/order/changeOrderStatus/${orderId}`, {
        status: status,
      })
    ).subscribe(
      (res: any) => {
        this.loading = false;
        console.log(res);
        if (res.status) {
          this._sb.success('Status Updated!');
          // this._sb.openSnackBar(res.message, 'OK', 3000)
          this.getOrder();
        } else {
          this._sb.error('Failed to update the status!');
          // this._sb.openSnackBar(res.message, 'OK', 3000)
        }
      },
      (err) => {
        this.loading = true;
        console.log(err);
        this._sb.error('Server is busy. Try again after sometime');
        // this._sb.openSnackBar('Server is busy. Try again after sometime', 'OK', 3000)
      }
    );
  }
}
