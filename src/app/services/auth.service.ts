import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { SnackBarService } from './snack-bar.service';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
const roleData: any = {
  superadmin: 'superAdmin',
  admin: 'admin',
  supermaster: 'superMaster',
  master: 'master',
  agent: 'agent'
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessType: any;
  public dataValueChange: Subject<object> = new Subject<object>();
  constructor(
    private router: Router,
    private _http: HttpClient
  ) { }

  async login(body) {
    const url = environment.serverUrl + '/user/login';
    return await this._http.post(url, body)
  }

  async adminLogin(body) {
    const url = environment.serverUrl + '/admin/login';
    return await this._http.post(url, body)
  }

  async exhibitorLogin(body) {
    const url = environment.serverUrl + '/exhibitor/login';
    return await this._http.post(url, body)
  }

  async register(body) {
    const url = environment.serverUrl + '/user';

    return await this._http.post(url, body)

  }

  async forgetpassword(body) {
    const url = environment.serverUrl + '/user/forgetPassword';

    return await this._http.post(url, body)

  }

  async updatePassword(id, body) {
    const url = environment.serverUrl + `/user/verifyLink/${id}/passwordReset`;

    return await this._http.post(url, body)

  }

  isAccessType() {
    if (!this.accessType) {
      this.accessType = localStorage.getItem('_accessType');
    }
    return this.accessType;
  }

  giveChildNodeName() {
    var adminListName = '';
    if (!this.accessType) {
      this.accessType = localStorage.getItem('_accessType');
    }
    switch (this.accessType) {
      case 'superAdmin':
        adminListName = 'Admin';
        break;
      case 'admin':
        adminListName = 'Super Master';
        break;
      case 'superMaster':
        adminListName = 'Master';
        break;
      case 'master':
        adminListName = 'Agent';
        break;
      default:
        adminListName = '';
        break;
    }
    return adminListName;
  }

  isAuthenticated() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn && isLoggedIn === 'true') {
      return true;
    } else {
      return false;
    }
  }

  logout(route = 'admin') {
    if (localStorage.getItem('isLoggedIn')) {
      localStorage.clear();
      this.router.navigate([route]);
    }
  }

  async refreshToken() {
      const url = environment.serverUrl + '/user/refresh';
      return await this._http.get(url, {
        headers:{
          "Authorization": "Bearer "+localStorage.getItem('token'),
        }
      })
  }

  async refreshToken1() {
      const url = environment.serverUrl + '/user/refresh';
      await this._http.get(url, {
        headers:{
          "Authorization": "Bearer "+localStorage.getItem('token'),
        }
      }).subscribe((res) => {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('token', res['token'])
        localStorage.setItem('user', JSON.stringify(res['data']))
        this.dataValueChange.next(res['data']);
      })
  }
}
