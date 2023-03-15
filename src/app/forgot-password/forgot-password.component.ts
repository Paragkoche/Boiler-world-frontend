import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  private selectedLink: string="mobile";    
  mobileSelected:boolean = false;   
  emailSelected:boolean = false;
  selection:any = 'email';


  form: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.email]),
    selection: new FormControl('')
  });

  error: string | null = null;
  hide = true;
  isLoggedIn: boolean = true;
  loading: boolean = false;
  disabled: boolean = false;
  optsent: boolean = false;

  constructor(
    private router: Router,
    private _auth: AuthService,
    public _sb: SnackBarService
  ) { }

  ngOnInit(): void {
    
  }

  async reset() {
    this.loading = true;
    this.error = null;
    console.log(this.form.value);
    if(this.form.invalid){
      
    }
    this.form.patchValue({ selection: this.selection });
    (await this._auth.forgetpassword(this.form.value)).subscribe( (res: any) => {
        this.loading = false;
        console.log(res)
        if( res.status ){
          this._sb.openSnackBar(res.message, 'CLOSE', 3000)
          this.disabled = true;
        }else{
          this._sb.openSnackBar(res.message, 'OK', 3000)
        }
      },
      err => {
        this.loading = false;
        this.error = err;
        this._sb.openSnackBar('Something went wrong!', 'OK', 3000)
      }
    );
  }

}
