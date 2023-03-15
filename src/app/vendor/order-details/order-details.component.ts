import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  loading : boolean = false;
  isLoadingResults : boolean = false
  displayedColumns: string[] = 
  ['createdAt','product_id','product_name',
  'product_price','product_quantity' ];
  // , 'exhibitor', 'createdAt','gst','sub_total','status'
  dataOrder = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  submited: boolean;
  order: any;
  
  



  constructor(
    private _http : HttpService,
    private _sb : SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }




  ngOnInit(): void {
    console.log(this.data);
    
    this.getOrder();
    // this.getExbName();
  }

  


  
  async getOrder(){
    // get all request for branch
    //  console.log('data');
    (await this._http.get(`/vendor/order/getSingleOrder/${this.data}`)).subscribe( (res:any) => {
      console.log(res)
      this.loading = false;
      this.dataOrder = res.data.orderItems
      this.order = res.data
      // console.log('data');
    })
  }




  
  async update(orderId:any, status:any){
    
    this.submited = true
    this.loading = true;
    ;(await this._http.put(`/vendor/order/changeOrderStatus/${orderId}`, 
    {
      status: status
    }
    )).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        this._sb.success('Status Updated!')
        // this._sb.openSnackBar(res.message, 'OK', 3000)
        this.getOrder();
      }else{
        this._sb.error('Failed to update the status!')
        // this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    }, err => {
      this.loading = true;
      console.log(err);
      this._sb.error('Server is busy. Try again after sometime')
      // this._sb.openSnackBar('Server is busy. Try again after sometime', 'OK', 3000)
    })
  }



}
function orderId(arg0: string, orderId: any) {
  throw new Error('Function not implemented.');
}

