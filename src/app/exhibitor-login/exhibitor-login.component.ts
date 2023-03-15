import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-exhibitor-login',
  templateUrl: './exhibitor-login.component.html',
  styleUrls: ['./exhibitor-login.component.scss']
})
export class ExhibitorLoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  error: string | null = null;
  hide = true;
  isLoggedIn: boolean = true;
  loading: boolean = false;
  optsent: boolean = false;

  constructor(
    private router: Router,
    private _auth: AuthService,
    public _sb: SnackBarService
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.loading = true;
    this.error = null;
    console.log(this.form.value);
    (await this._auth.exhibitorLogin(this.form.value)).subscribe( (res: any) => {
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
            this.router.navigateByUrl('exhibitor');
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
