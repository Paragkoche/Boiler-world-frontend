import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SnackBarService } from 'src/app/services/snack-bar.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {


  displayedColumns: string[] = ['image','name','description','price', 'action'];
  
  dataProduct = new MatTableDataSource();
  isLoadingResults: boolean;
  // paginator: any;
  // readonly: boolean;
  loading: boolean = false ;



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataProduct.filter = filterValue.trim().toLowerCase();
  }


  constructor(
    private _http : HttpService,
    private route : Router,
    private _sb : SnackBarService

  ) { }

  

  ngOnInit(): void {
    // this.getproduct();
    this.getDataList();
  }


  
  totalPages: any;
  q:string = 'vendor/getAllVendorProduct';
  limit:number = 10;
  page:number = 0;
  query:string = '';
  // status:string = '';
  order:string = 'desc';
  pageSizeOptions: number[] = [5, 10, 25, 100];
  async getDataList(index = 4){
    // this._sb.loading('Loading Products!')
    // this.loading = false;
    this.isLoadingResults = true;
 
        // Page manipulation
      if(index == 9){
        if(this.page > 1)
          this.page--;
        else return;
      }
        
      if(index == 10)
        this.page++;

        
      else
        this.q = this.q;


        (await this._http.get(`/${this.q}?page=${this.page}&limit=${this.limit}&query=${this.query}&order=${this.order}`)).subscribe( (res:any) => {
         
          console.log(res)
          this.isLoadingResults = false;
          if(res.status){
            this._sb.success('Product Loaded')
            this.totalPages = res.data.totalItems
            this.dataProduct = res.data.rows
            setTimeout(() => {
             
              this.paginator.pageIndex = this.page;
              this.paginator.length = res.data.totalItems;
            });
            this.dataProduct.paginator = this.paginator;
          }else{
            this._sb.error('Product Load Failed!')
            // this._sb.openSnackBar(res.message, 'OK', 3000)
          }
        }, err => {
          
          this.isLoadingResults = false;
          this._http.handleError(err);
        })
      }


    
  async getproduct(){
    // get all request for branch
    //  console.log('data');
    (await this._http.get('/vendor/getAllVendorProduct')).subscribe( (res:any) => {
      console.log(res)
      this.loading = false;
      this.dataProduct = res.data
      console.log('data');
    })
  }

  
  pageChanged(event: PageEvent) {
    console.log({ event });
    this.loading = false;
    this.limit = event.pageSize;
    this.page = event.pageIndex;
    this.getDataList();
  }


  
  async delete(product:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: '#f12711',
      background: '#319447',
      
      // color: '#FFFFFF',
      confirmButtonColor: '#2B8797',
      cancelButtonColor:'#f5af19',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    })
    .then(async (result) => {
      if (result.isConfirmed) {

        (await this._http.delete(`/vendor/deleteProduct`, product.id)).subscribe( (res:any)=> {
          if(res.status){
            Swal.fire(
              'Deleted!',
              res.message,
              'success'
            ).then(() => {
              this.getDataList();
            })
          }else{
            Swal.fire(
              'Failed',
              res.message,
              'error'
            )
          }
        },(err) => {
          Swal.fire(
            'Error',
            'Try again after some time',
            'error'
          )
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Canceled',
          'Your action is cancelled :)',
          'error'
        )
      }
    })
  }



}
