import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  error: string | null = null;
  hide = true;
  type:string = 'password';
  ctype:string = 'password';
  icon:string = 'hide';
  cicon:string = 'hide';
  isLoggedIn: boolean = true;
  loading: boolean = false;
  optsent: boolean = false;
  form: FormGroup;

  checkIfMatchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value == confirmPassword.value) {
        return;
      } else {
        // this.errorMsg = "Password does not match."
        confirmPassword.setErrors({
          notEqualToPassword: true
        })
      }

    }
  }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): any => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
  
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
  
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  disabled: boolean;
  id: any;
  token: any;
  constructor(
    private router: Router,
    private _auth: AuthService,
    public _sb: SnackBarService,
    private activatedParam: ActivatedRoute,
    public _fb: FormBuilder
  ) {
    this.activatedParam.params.subscribe( (res:any) => {
      this.id = res.id
      this.token = res.token
    })

    if( !this.id || !this.token ){
      this._sb.openSnackBar('Token Expired', 'OK');
      this.router.navigateByUrl('/forgetpassword');
    }

    this.form = this._fb.group({
      password: ['', [Validators.compose([
        Validators.required,
        this.patternValidator(/\d/, { hasNumber: true }),
        this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
  
         // 4. check whether the entered password has a lower-case letter
         this.patternValidator(/[a-z]/, { hasSmallCase: true }),
         // 5. check whether the entered password has a special character
         this.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, { hasSpecialCharacters: true }),
         Validators.minLength(8)
        ])]],
      cpassword: new FormControl(''),
      token: new FormControl('')
    }, { validator: this.checkIfMatchingPasswords("password", "cpassword") });

    this.form.patchValue({
      token: this.token
    })

   }

  toggle(field){
    if( field == 'password' ){
      if( this.type == 'password' ){
        this.type = 'text'
        this.icon = 'show'
      }else{
        this.type = 'password'
        this.icon = 'hide'
      }
    }
    if( field == 'cpassword' ){
      if( this.ctype == 'password' ){
        this.ctype = 'text'
        this.cicon = 'show'
      }else{
        this.ctype = 'password'
        this.cicon = 'hide'
      }
    }
  }

  get password() {
    return this.form.get('password');
  } 

  ngOnInit(): void {
  }

  async reset() {
    
    console.log(this.form.value);
    if(this.form.invalid){
      return
    }
    if( this.form.value.password !=  this.form.value.cpassword){
      this._sb.openSnackBar('Password does not match', 'CLOSE', 3000)
      return
    }
    this.loading = true;
    this.error = null;

    (await this._auth.updatePassword(this.id, this.form.value)).subscribe( (res: any) => {
        this.loading = false;
        console.log(res)
        if( res.status ){
          this._sb.openSnackBar(res.message, 'CLOSE', 3000)
          this.disabled = true;
          this.router.navigateByUrl('/login')
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
