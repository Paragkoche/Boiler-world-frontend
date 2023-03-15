import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { SnackBarService } from '../services/snack-bar.service';
@Component({
  selector: 'app-corporate-registration',
  templateUrl: './corporate-registration.component.html',
  styleUrls: ['./corporate-registration.component.scss']
})
export class CorporateRegistrationComponent implements OnInit {
  corporateForm: FormGroup;
  loading: boolean = false;

  constructor(
    private _http: HttpService,
    public _sb: SnackBarService
  ) { }

  ngOnInit(): void {
    this.corporateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      company_repName: new FormControl('', Validators.required),
      company_name: new FormControl('', Validators.required),
      blood_group: new FormControl('', Validators.required),
      mobile_no: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      designation: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      exhibitor: new FormControl('', Validators.required),
      pro_category: new FormControl('', Validators.required),
      gst_no: new FormControl('', Validators.required),
    });
  }

  async register(){
    console.log(this.corporateForm.value)
    this.loading = true;
    ;(await this._http.postWithoutToken('/corporate', this.corporateForm.value)).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  reset(){
    this.corporateForm.reset();
  }


}
