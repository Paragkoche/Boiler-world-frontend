import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import Swal from 'sweetalert2'

import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  header = new HttpHeaders().set("Content-Type", "multipart/form-data").set("Autorization", "Bearer ritwikchavhan")
  company_profile:string;
  companyForm: FormGroup
  submited: boolean;
  loading: boolean;
  user: any;
  file: any;
  progress: any;
  errorMsg: string;
  successMsg: string;
  uploadStart: boolean;
  oemProgress:number = 0;
  orders: any = [];
  private _subscription: any;
  constructor(
    private _fb: FormBuilder,
    public _sb: SnackBarService,
    private _http: HttpService,
    private _auth: AuthService,
    public dialog: MatDialog
  ) {
    // this.refreshToken();
    this.getUser();
    this.companyForm = this._fb.group({
      company_profile: [this.user.company_profile, [ Validators.required, Validators.maxLength(1000) ]]
    });
    this.getOemProgress();
    this.getOrder();

    this._subscription = this._auth.dataValueChange.subscribe((value) => {
      console.log(value)
      this.user = value
    });
    
   }

   async refreshToken(){
    this._sb.openSnackBar('Refreshing Data...', 'Close');
    (await (this._auth.refreshToken())).subscribe((res: any) => {
     if (res.status) {
       localStorage.setItem('isLoggedIn', 'true')
       localStorage.setItem('token', res.token)
       localStorage.setItem('user', JSON.stringify(res.data))
     }
     this.getUser();
     this._sb.openSnackBar('Data Refreshed!', 'OK');
   })
  }

  ngOnInit(): void {
    
  }

  async update(){
    console.log(this.companyForm.value)
    if(this.companyForm.invalid){
      return;
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', this.companyForm.value)).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Added',
          text: 'Company profile updated!'
        })
        this.user.company_profile = this.companyForm.value.company_profile
        localStorage.setItem('user', JSON.stringify(this.user));
        this.getUser();
        // this.companyForm.reset()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  get companyProfile() {
    return this.companyForm.get('company_profile');
  }

  getUser(){
    const userJson = localStorage.getItem('user');
    this.user = userJson !== null ? JSON.parse(userJson) : {};
  }

  async companyLogo(e){
    console.log(e.target.files[0])
    this.file = e.target.files[0]
    
  }

  async companyLogoUpload(){
    let formData = new FormData();
    formData.set('file', this.file, this.file.name);
    this.uploadStart = true;
    this._http.postWithStatus('/exhibitor/uploadLogo', formData).subscribe((event:any) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          console.log(Math.round(event.loaded / event.total * 100));
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          if (event.body.status) {
                  this.user.company_logo = event.body.url
                  localStorage.setItem('user', JSON.stringify(this.user));
                  this.getUser();
                  this._sb.openSnackBar(event.body.message, 'OK')
                  this.uploadStart = false;
                  this.file = null;
                } else {
                  this._sb.openSnackBar(event.body.message, 'OK')
                }

      }
    })
  }

  async getOemProgress(){
    (await this._http.get('/exhibitor/getOEMProgress')).subscribe((res:any) => {
      console.log(res)
      this.oemProgress = res.data.oem.progress
    })
  }

  async getOrder(){
    (await this._http.get('/exhibitor/getOrders')).subscribe((res:any) => {
      console.log(res)
      this.orders = res.data
    })
  }

  showOrderDetial(order) {
    this.dialog.open(OrderDetailComponent, {
      data: {
        order: order,
      },
    });
  }
}
