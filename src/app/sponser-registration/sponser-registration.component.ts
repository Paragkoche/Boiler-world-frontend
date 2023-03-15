import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-sponser-registration',
  templateUrl: './sponser-registration.component.html',
  styleUrls: ['./sponser-registration.component.scss']
})
export class SponserRegistrationComponent implements OnInit {
  sponserForm: FormGroup;
  loading: boolean = false;

  constructor(private _http: HttpService,
    public _sb: SnackBarService) { }

    ngOnInit(): void {
      this.sponserForm = new FormGroup({
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
        company_website: new FormControl('', Validators.required),
      });
    }
  
    async register(){
      console.log(this.sponserForm.value)
      this.loading = true;
      ;(await this._http.postWithoutToken('/exhibitor', this.sponserForm.value)).subscribe( (res:any) => {
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
      this.sponserForm.reset();
    }

}
