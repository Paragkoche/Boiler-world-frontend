import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  error: string | null = null;
  hide = true;
  type:string = 'password';
  icon:string = 'hide';
  isLoggedIn: boolean = true;
  loading: boolean = false;
  optsent: boolean = false;

  constructor(
    private router: Router,
    private _auth: AuthService,
    public _sb: SnackBarService
  ) { }

  toggle(){
    if( this.type == 'password' ){
      this.type = 'text'
      this.icon = 'show'
    }else{
      this.type = 'password'
      this.icon = 'hide'
    }
  }

  ngOnInit(): void {
  }

  async login() {
    this.loading = true;
    this.error = null;
    console.log(this.form.value);
    (await this._auth.login(this.form.value)).subscribe( (res: any) => {
        this.loading = false;
        console.log(res)
        if( res.status ){
          this._sb.openSnackBar(res.message, 'CLOSE', 3000)
          localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('token', res.token)
            localStorage.setItem('user', JSON.stringify(res.data))
            this.isLoggedIn = true;
            this.loading = false;
            this.error = null;
            this.router.navigateByUrl(res.route);
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
