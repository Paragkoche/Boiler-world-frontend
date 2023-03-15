import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {
 

  productForm !: FormGroup;

  selectedFile: File;
  productId:any;
  product: any;
  dataProduct: any;
  readonly: boolean = true;
  submited: boolean = true;
  loading: boolean = true;
  isEditable: boolean = true;
  selectedImagePreview: any;

  constructor( 
    private _activatedRoute: ActivatedRoute,
    private _http : HttpService,
    private _sb : SnackBarService
    ) {
    this._activatedRoute.params.subscribe( (data:any) => {
      this.productId = data.id;
      
    })
    
   }

  ngOnInit(): void {
    this.initproductForm();
    this.getproductById()
    
  }
  

  
initproductForm(){
  this.productForm = new FormGroup({
    name : new FormControl({ value : '', disabled : this.isEditable }, [Validators.required]),
    image : new FormControl({ value : '', disabled : this.isEditable }),
    description : new FormControl({ value : '', disabled : this.isEditable }, [Validators.required]),
    price : new FormControl({ value : '', disabled : this.isEditable }, [Validators.required]),
  })
}





confirmEdit(){
  Swal.fire({
    title: 'Are you sure ?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    iconColor: '#f12711',
    background: '#319447',
    // color: '#FFFFFF',
    confirmButtonColor: '#2B8797',
    cancelButtonColor:'#f5af19',
    showCancelButton: true,
    confirmButtonText: 'Yes, Edit it!',
    cancelButtonText: 'No, Cancel!',
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      this.productForm.enable(); 
      this.readonly = !this.readonly

    }
  })
}



// async update(){
//   console.log(this.productForm.value)
//   if(this.productForm.invalid){
//     return;
//   }
//   this.submited = true
//   this.loading = true;
//   console.log(this.productId)
//   ;(await this._http.put(`/vendor/updateVendorProduct/${this.productId}`, this.productForm.value)).subscribe( (res:any) => {
//     this.loading = false;
//     console.log(res)
//     if(res.status){
//       this._sb.openSnackBar(res.message, 'OK', 3000)
//       this.productForm.disable(); 
//       this.readonly = !this.readonly
//       this.submited = false;
//       this.productForm.reset()
//     }else{
//       this._sb.openSnackBar(res.message, 'OK', 3000)
//     }
//   }, err => {
//     this.loading = true;
//     console.log(err);
//     this._sb.openSnackBar('Server is busy. Try again after sometime', 'OK', 3000)
//   })
// }


async update(){
  console.log(this.productForm.value)
  if(this.productForm.invalid){
    return;
  }
  this.submited = true
  this.loading = true;
  console.log(this.productId);
  (await this._http.put(`/vendor/updateProduct/${this.productId}`,this.productForm.value)).subscribe( (res:any) => {
    this.loading = false;
    console.log(res)
    if(res.status){
      this._sb.success('Product updated successfully')
      // this._sb.openSnackBar(res.message, 'OK', 3000);
      this.loading = false;
      this.isEditable = true;
      this.productForm.disable();
      this.readonly = true
    }else{
      this._sb.error('Failed to update the Product')
      // this._sb.openSnackBar(res.message, 'OK', 3000)
    } 
  }, err => {
    // this.loading = true;
    console.log(err);
    this._sb.error('Server is busy. Try again after sometime')
    // this._sb.openSnackBar('Server is busy. Try again after sometime', 'OK', 3000)
  })
}



async getproductById(){
  // get all request for branch
  //  console.log('getdoctor');
  (await this._http.get(`/vendor/getSingleProduct/${this.productId}`)).subscribe( (res:any) => {
    console.log(res )
    this.dataProduct = res.data
    if(res.status){
      this.loading = false;
      this.productForm.patchValue(
        {
          name : res.data.name,
          image : res.data.image,
          description :res.data.description,
          price : res.data.price,
        }
      )
    }else{
      this.loading = false;
      this._sb.error('Failed!')
      // this._sb.openSnackBar(res.message,'ok');
    }
  })
}



async onFileChanged(e:any){
  this.selectedFile = e.target.files[0]

  

  if (this.selectedFile) {
    const reader = new FileReader();
      reader.onload = async (e: any) => {
        this.loading =  false;
        console.log(e.target.result);
        // this.selectedImagePreview = e.target.result;
        // uplode file
        let productFormData = new FormData();
        productFormData.append('file', this.selectedFile, this.selectedFile.name);
        this._sb.loading('uploading image...');
        (await this._http.post('/vendor/productUpload', productFormData)).subscribe((res: any) => {
          this.loading =  false;
          this._sb.close();
          console.log(res);
          if (res.status) {
            this.loading =  false;
            this._sb.success(res.message)
            // this.dialogRef.close();
            this.productForm.patchValue({
              image: res.url
            });
          } else {
            this.loading =  false;
            this._sb.error(res.message)
          }
        })
      };
      reader.readAsDataURL(this.selectedFile);
      console.log(this.selectedImagePreview);
  }

}



}
