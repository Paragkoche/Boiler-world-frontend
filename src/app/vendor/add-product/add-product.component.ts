import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  // productForm = FormGroup;
  loading: boolean = false;
  
  productForm !: FormGroup;
  selectedFile: File
  selectedImagePreview: any;
 

  constructor(
    private _http : HttpService,
    public _sb: SnackBarService,

  ) { }

  ngOnInit(): void {
    this.loading =  false;

    this.initproductForm();
    this.init_productForm_FORM();
}
    
  

initproductForm(){
  this.productForm = new FormGroup({
    name : new FormControl({ value : '', disabled : false }, [Validators.required]),
    image : new FormControl({ value : '', disabled : false }),
    description : new FormControl({ value : '', disabled : false }, [Validators.required]),
    price : new FormControl({ value : '', disabled : false }, [Validators.required]),
  })
}
  async submitproductForm() {
    console.log(this.productForm.value);
    if (this.productForm.invalid) { 
      alert("All fields are required!");
      return
    }
    if(!this.selectedFile){
      this._sb.openSnackBar('Please select Product Image', 'OK');
      return
    }
    (await this._http.post('/vendor/addVendorProduct', this.productForm.value)).subscribe((res: any) => {
      this.loading =  false;

      console.log(res);
      if (res.status) {
        this.loading =  false;
        this._sb.openSnackBar(res.message, 'OK')
        // this.dialogRef.close();
      } else {
        this.loading =  false;
        this._sb.openSnackBar(res.message, 'OK')
      }
    })
  }

  products(){
    return new FormGroup({
      name: new FormControl({ value: '', disabled: false }, [Validators.required]),
      description: new FormControl({ value: '', disabled: false }, [Validators.required]),
      price: new FormControl({ value: '', disabled: false }, [Validators.required]),
      image: new FormControl({ value: '', disabled: false },[Validators.required]),
    })
  }

  init_productForm_FORM(){
    this.productForm = new FormGroup({
      products: new FormArray([this.products()])
    })
    this.getproducts();
  }

  addproducts(){
    console.log('rehjvbfjkhbkjhkb');
    (<FormArray>this.productForm.get('products')).push(this.products());
  }

  getproducts(){
    return (<FormArray>this.productForm.get('products')).controls;
  }

  removeproducts(i:number){
    (<FormArray>this.productForm.get('products')).removeAt(i);
  }




  async onFileChanged(e:any, index){
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
            this.setProductImage(index, res.url);
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

  setProductImage(index, url){
    // get the control of the form from index
    let control = (<FormArray>this.productForm.get('products')).at(index);
    control.patchValue({
      image: url
    });
  }

  getProductAtIndex(index){
    console.log('----------------------');
    console.log((<FormArray>this.productForm.get('products')).at(index).get('image')?.value);
    return (<FormArray>this.productForm.get('products')).at(index);
  }
  
}

  

