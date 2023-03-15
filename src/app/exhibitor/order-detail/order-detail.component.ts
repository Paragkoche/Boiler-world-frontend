import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http: HttpService
  ) { 
    this.getOrderDetail()
  }

  ngOnInit(): void {
  }

  async getOrderDetail() {
    (await this._http.get(`/exhibitor/getOrderDetail/${this.data.order}`)).subscribe((res: any) => {
      console.log(res);
      
      if (res.status) {
        this.order = res.data
      }
    })
  }

}
