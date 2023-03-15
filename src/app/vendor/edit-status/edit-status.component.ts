import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.scss']
})
export class EditStatusComponent implements OnInit {
  statusList: any =[];
  statusForm !: FormGroup;
  loading: boolean = true;
  readonly: boolean = true;
  submited: boolean = true;
  productId: any;
  orderId: any;
  dataOrder: any;
  orderForm: any;

  constructor(
    private _http : HttpService,
    private _sb : SnackBarService
  ) { }

  ngOnInit(): void {
    this.getOrderById()
  }

  initstatusForm() {
    this.statusForm = new FormGroup({
      status: new FormControl({ value: '', disabled: true }, [Validators.required]),
      })
  }


    

confirmEdit(){
  Swal.fire({
    title: 'Are you sure ?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    iconColor: '#f12711',
    background: '#319447',
    // color: '#FFFFFF',
    confirmButtonColor: '#2B8797',
    cancelButtonColor:'#f5af19',
    showCancelButton: true,
    confirmButtonText: 'Yes, Edit it!',
    cancelButtonText: 'No, Cancel!',
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      this.orderForm.enable(); 
      this.readonly = !this.readonly

    }
  })
}



async update(){
  console.log(this.orderForm.value)
  if(this.orderForm.invalid){
    return;
  }
  this.submited = true
  this.loading = true;
  console.log(this.orderId);
  (await this._http.put(`vendor/updateVendorProduct/${this.orderId}`, this.orderForm.value)).subscribe( (res:any) => {
    this.loading = false;
    console.log(res)
    if(res.status){
      this._sb.openSnackBar(res.message, 'OK', 3000)
      this.orderForm.disable(); 
      this.readonly = !this.readonly
      this.submited = false;
      this.orderForm.reset()
    }else{
      this._sb.openSnackBar(res.message, 'OK', 3000)
    } 
  }, err => {
    this.loading = true;
    console.log(err);
    this._sb.openSnackBar('Server is busy. Try again after sometime', 'OK', 3000)
  })
}



async getOrderById(){
  // get all request for branch
  //  console.log('getdoctor');
  (await this._http.get(`/vendor/order/changeOrderStatus/${this.orderId}`)).subscribe( (res:any) => {
    console.log(res )
    this.dataOrder = res.data
    if(res.status){
      this.orderForm.patchValue(
        {
          status : res.data.name,
          
        }
      )
    }else{
      this._sb.openSnackBar(res.message,'ok');
    }
  })
}


}
