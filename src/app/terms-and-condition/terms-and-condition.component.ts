import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpService } from '../services/http.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss']
})
export class TermsAndConditionComponent implements OnInit {
  name : any;
  company_name : any;
  isChecked: boolean = false; 
  designation: any;
  loading: boolean = false;
  exhibitorDetail : any;
  submited: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<TermsAndConditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http: HttpService,
    public _sb: SnackBarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.exhibitorDetail = this.data.exhibitorData.exhibitorDetails
    this.name = this.exhibitorDetail.company_repName
    this.company_name = this.exhibitorDetail.company_name
    this.designation = this.exhibitorDetail.designation
  }


    async register()
    {
    
      console.log(this.exhibitorDetail)
      console.log(this.isChecked)
      this.submited = true
      this.loading = true;
      


      if(this.isChecked){
        (await this._http.postWithoutToken('/exhibitor', this.exhibitorDetail)).subscribe( (res:any) => {
          this.loading = false;
          console.log(res)
          if(res.status){
            // this.resetForm(this.exhibitorForm)
            // this.exhibitorForm.markAsPristine();
            // this.exhibitorForm.markAsUntouched();
            // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
            //Swal.fire({
              //title: 'Congratulations! You have registered successfully.',
              //icon: 'success',
              //html:'Please check your registered email id for more details.'
                // 'Our representative will get in touch with you soon.<br>' +
                // 'In the meanwhile <a href="/login">Sign</a> in to submit stall preferences.'
              //  ,
              //showCloseButton: false,
              //showCancelButton: true,
              //showConfirmButton: false,
              //focusConfirm: false,
              // confirmButtonText:
              //   '<a style="color:white" href="/login">Sign In</a>',
              // confirmButtonAriaLabel: 'Sign In!',
              //cancelButtonText:
              //  '<i class="fa fa-thumbs-down"></i>OK',
              //cancelButtonAriaLabel: 'OK'
            //}).then(() => {              
              //window.location.reload()
            //})
            
            this.router.navigateByUrl('exhibitor-confirmation');
            this.dialogRef.close()
            this.submited = false;
            // this.exhibitorForm.reset()
          }else{
            this._sb.openSnackBar(res.message, 'OK', 3000)
          }
        })
   
      }
      else{
        this._sb.openSnackBar('Please accept terms and conditions', 'OK' , 3000)
      }
  }
  decline(){
    this.dialogRef.close()
  }

  activeChange(e:any){
    console.log(e)
    this.isChecked = e.checked
    console.log(this.isChecked)
  }
}
