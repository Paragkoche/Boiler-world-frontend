import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SnackBarService } from './services/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'boiler-dashboard';

  constructor(
    private _sb: SnackBarService,
    private _auth: AuthService
  ) {
    this.refreshToken();
   }

   async refreshToken(){
    // this._sb.openSnackBar('Refreshing Data...', 'Close');
    (await (this._auth.refreshToken())).subscribe((res: any) => {
     if (res.status) {
       localStorage.setItem('isLoggedIn', 'true')
       localStorage.setItem('token', res.token)
       localStorage.setItem('user', JSON.stringify(res.data))
     }
    //  this._sb.openSnackBar('Data Refreshed!', 'OK');
   })
  }
}
