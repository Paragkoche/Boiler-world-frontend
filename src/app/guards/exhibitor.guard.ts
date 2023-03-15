import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExhibitorGuard implements CanActivate {
  constructor(
    private router: Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject) => {
        let user = JSON.parse(localStorage.getItem('user') || '{}')
        let auth_token = localStorage.getItem('token');
        // console.log(name,id,auth_token)
        if (auth_token != null){
          // this.gVar.isLoggeddIn = true;
          if(user.role === 'exhibitor')
            resolve(true);
          else { reject(false); this.router.navigateByUrl('exhibitor-login') }
        }
          
        else {
          reject(false);
          this.router.navigateByUrl('exhibitor-login');
        }
  
      })
  }
  
}
