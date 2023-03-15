import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  
  displayedColumns: string[] = ['image','name','description','price'];
  // private _http: any;
  dataProduct = new MatTableDataSource();
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataProduct.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private _http : HttpService,
    private route : Router) { }

  ngOnInit(): void {
    this.getproduct()
  }

    
  async getproduct(){
    // get all request for branch
    //  console.log('data');
    (await this._http.get('/vendor/getAllVendorProduct')).subscribe( (res:any) => {
      console.log(res.data)
      // this.dataProduct = res.data
      
    })
  }


}
