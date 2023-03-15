import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    mobile_no: new FormControl(''),
    role: new FormControl('')
  });

  error: string | null = null;
  hide = true;
  isLoggedIn: boolean = true;
  loading: boolean = false;
  constructor(
    private router: Router,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  async register() {
    this.loading = true;
    this.error = null;
    console.log(this.form.value)
    // return
    ;(await this._auth.register(this.form.value)).subscribe((res :any) => {
      console.log(res)
      this.loading = false;
      if(res.status){
        alert(res.message)
        this.isLoggedIn = true;
        this.error = null;
        this.router.navigate(['home']);
      }else{
        alert(res.message)
      }
    }, err => {
      this.loading = false;
      this.error = err;
    });
  }

}
