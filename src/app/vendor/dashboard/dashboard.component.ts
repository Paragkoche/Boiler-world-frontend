import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProgressComponent } from 'src/app/common/progress/progress.component';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  _subscription: any;
  logoPreview:any;
  selectedLogo:any;
  progress: number;
  constructor(
    private _http: HttpService,
    public _sb: SnackBarService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this._subscription = this._http.dataValueChange.subscribe(data => {
      this.user = data;
    })
  }


  async onLogoSelect(e:any){
    this.selectedLogo = e.target.files[0]

    if (this.selectedLogo) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log(e.target.result);
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedLogo);
      console.log(this.logoPreview);
      
    }

  }

  uploadStart:  boolean = false;
  async uploadLogo(){
    const formData = new FormData();
    formData.append('file', this.selectedLogo, this.selectedLogo.name);
    (await this._http.postWithStatus('/vendor/uploadLogo', formData)).subscribe((event: any) => {
      console.log(event);
      this.uploadStart = true;
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          console.log(Math.round(event.loaded / event.total * 100));
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          if (event.body.status) {
            this.uploadStart = false;
            this.user.company_logo = event.body.url;
            this._http.setLocalStorage('user', this.user);
            this.logoPreview = null;
            this.selectedLogo = null;
            this._sb.success('Logo uploaded successfully');
          } else {
            this._sb.error(event.body.message);
          }

      }
    })
  }
}
