import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ExhibitorRegistrationComponent } from 'src/app/exhibitor-registration/exhibitor-registration.component';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2'
import { NgOtpInputConfig } from 'ng-otp-input';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  numberOTP:number;
  numberOTPError:any = '';
  otpMessage:any = '';
  loading:boolean = false
  otpErrorMessage: any;
  config :NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };

  otp: string;
  otpLoading:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ExhibitorRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http: HttpService
  ) { }

  async ngOnInit() {
    
  }

  onOtpChange(otp) {
    this.otp = otp;
  }



  async verify(){
    this.loading = true;
    this._http.postWithoutToken('/otp/verify', {
      field: this.data.value,
      type: this.data.field,
      otp: this.numberOTP
    }).then( res => {
      this.loading = false;
      res.subscribe( (res:any) => {
        if(res.status){
          if( this.data.field == 'email')
            this.data.emailVerified = true
          else this.data.numberVerified = true

          Swal.fire({
            icon: 'success',
            title: 'OTP verified',
          }).then( () => {
            this.dialogRef.close(this.data)
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: res.message,
          })
        }
      })
    }, err => this.loading = false)

  }

  ngAfterViewInit(){
    this.generateOTP()
  }

  
  resend(): void {
    this.generateOTP();
  }

  async generateOTP(){
    this.loading = true;
    console.log({
      field: this.data.value
    });
    this._http.postWithoutToken('/otp/generate', {
      field: this.data.value,
      type: this.data.field,  
    }).then( res => {
      this.loading = false;
      res.subscribe( (resp:any) => {
        console.log(resp)
        if(resp.status){
          this.otpMessage = resp.message
        }else{
          this.otpErrorMessage = resp.message
        }
      })
    }, err => {
      this.loading = false; 
      this.otpErrorMessage = 'Something went wrong'
    })
  }
}
