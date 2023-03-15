import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  opened = true;
  accessType: string = '';
  adminListName: string = '';
  credits: any;
  name: string = '';
  _subscription: any;
  win: any = window;
  isMobile: Boolean = false;
  user: any | null;

  constructor(
    private router: Router,
    private _auth: AuthService
  ) { 
    this.isMobile = this.win?.visualViewport?.width < 400;
    this.opened = this.isMobile ? false : true;
    this.getUser();
    this._subscription = this._auth.dataValueChange.subscribe((value) => {
      console.log(value)
      this.user = value
    });
  }

  ngOnInit(): void {
  }

  
  getUser(){
    const userJson = localStorage.getItem('user');
    this.user = userJson !== null ? JSON.parse(userJson) : {};
  }

  ngAfterViewInit(){
    let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
      arrow[i].addEventListener("click", (e: any)=>{
      let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
      arrowParent.classList.toggle("showMenu");
      });
    }

      let sidebar: any = document.querySelector(".sidebar");
      let sidebarBtn: any = document.querySelector(".bx-menu");
      console.log(sidebarBtn);
      sidebarBtn.addEventListener("click", ()=>{
      sidebar.classList.toggle("close");
    });
  }

  navigateToPage(path: string){
    this.router.navigateByUrl(path);
    if(this.isMobile){
      this.opened = false;
    }
  }

  logout() {
    Swal.fire({
      title: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._auth.logout('login');
      }
    })
  }
  
}
