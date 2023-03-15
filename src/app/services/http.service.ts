import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackBarService } from './snack-bar.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  token: any;
  role: any;
  id: any;
  app: any;
  user: any;
  public dataValueChange: Subject<object> = new Subject<object>();
  constructor (
    private _http: HttpClient,
    private _snackBarService: SnackBarService, private router: Router) { 
      
    }

    async setHeaders(){
      this.token = localStorage.getItem('token')

      const userJson = localStorage.getItem('user');
      this.user = userJson !== null ? JSON.parse(userJson) : {};
      this.role = this.user.role
      // this.role = 'admin'
    }

    async get(url) {
      this.setHeaders();
      // console.log(this.token, this.role)
       return await this._http.get(`${environment.serverUrl}${url}`, {
         headers:{
           "Authorization": "Bearer "+this.token,
           "role": this.role
         }
       })
     }

     async getWithoutToken(url) {
       return await this._http.get(`${environment.serverUrl}${url}`)
     }
   
     async getById(url, id) {
       this.setHeaders();
      
       return await this._http.get(`${environment.serverUrl}${url}/${id}`, {
         headers:{
           "Authorization": "Bearer "+this.token,
           "role": this.role
         }
       })
     }
   
     async post(url, body:any) {
       this.setHeaders();
   
       return await this._http.post(`${environment.serverUrl}${url}`, body, {
         headers:{
           "Authorization": "Bearer "+this.token,
           "role": this.role
         }
       })
     }

     async postWithoutToken(url, body:any) {
      if(body.pro_category != undefined){
        body.pro_category = body.pro_category.toString();
        body.exhibitor_products = body.pro_category.toString();
      }
      return await this._http.post(`${environment.serverUrl}${url}`, body)
    }
   
     postWithStatus(url:any, body:any): Observable<HttpEvent<any>> {
       this.setHeaders();
   
       return this._http.post(`${environment.serverUrl}${url}`, body, {
           headers:{
             "Authorization": "Bearer "+this.token,
             "role": this.role
           },
           reportProgress: true,
           observe: 'events'
         })
     }
   
     async put(url, body:any) {
       this.setHeaders();
      
       return await this._http.put(`${environment.serverUrl}${url}`, body, {
         headers:{
           "Authorization": "Bearer "+this.token,
           "role": this.role
         }
       })
     }
   
     async delete(url, id:any) {
       this.setHeaders();
       
       return await this._http.delete(`${environment.serverUrl}${url}/${id}`, {
         headers:{
           "Authorization": "Bearer "+this.token,
           "role": this.role
         }
       })
     }

  public handleError (error: HttpErrorResponse) {
    console.log(error)

    if(error.status === 403){
      this._snackBarService.openSnackBar(error.error.message, 'close', 5000)
      this.router.navigate([error.error.redirect]);
      return
    }
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      return throwError('An error occurred: ' + error.error);
    } else {
      if (error.error?.statusCode === 401 && error.error?.message === 'Unauthorized') {
        this._snackBarService.openSnackBar('Session Timeout! Please login again to continue!', 'close', 5000)
        localStorage.clear();
        this.router.navigate(['login']);
      }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      return throwError(error.error?.message);
    }
  }

  // Get myprofile and store in localstorage
  async getMyProfile() {
    this.setHeaders();
    return await this._http.get(`${environment.serverUrl}/exhibitor/getMyProfile`, {
      headers:{
        "Authorization": "Bearer "+this.token,
        "role": this.role
      }
    })
  }

  // localstorage Operation
  setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    this.dataValueChange.next(value);
  }

  getLocalStorage(key) {
    return localStorage.getItem(key);
  }

}
