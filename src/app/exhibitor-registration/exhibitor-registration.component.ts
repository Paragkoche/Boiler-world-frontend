import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { SnackBarService } from '../services/snack-bar.service';
import { pan, zoom, getScale, setScale, resetScale } from 'svg-pan-zoom-container';
import Swal from 'sweetalert2'
import { OtpComponent } from '../exhibitor-register/otp/otp.component';
import { MatSelect } from '@angular/material/select';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
declare var jQuery: any;
declare function svgPanZoom(a: any, b: any): any;
import { NgOtpInputConfig } from 'ng-otp-input';
import { MatDialog } from '@angular/material/dialog';
import { TermsAndConditionComponent } from '../terms-and-condition/terms-and-condition.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exhibitor-registration',
  templateUrl: './exhibitor-registration.component.html',
  styleUrls: ['./exhibitor-registration.component.scss']
})
export class ExhibitorRegistrationComponent implements OnInit {

  hide = true;
  view = true;

  wtspNo: boolean = false
  @ViewChild('country') country: MatSelect
  @ViewChild('phone') phone: NgxMatIntlTelInputComponent
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  exhibitorForm: FormGroup;
  loading: boolean = false;
  submited: boolean = false;
  IsOtherCat: boolean = false;  
  IsOtherProd: boolean = false;
  type;
  numberVerified: boolean = false;
  emailVerified: boolean = false;

  manufacturerVal:string[] = [];

  image = '../../assets/BI22-Latest-Exhibition-Floor-plan.jpg';
  tp: string;
  showOtpComponent = false;
  numberOTP: number | undefined = 123456;
  numberOTPError: any = '';
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };
  otpLoading: boolean = false;
  otpMessage: string = '';
  otpErrorMessage: string = '';
  otp: string | undefined;
  selectedProCategory = [];
  selectedProductCategory = [];
  otpSentTo: String = '';



  constructor(
    private _http: HttpService,
    public _sb: SnackBarService,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.exhibitorForm = this._fb.group({
      company_repName: ['', Validators.compose([
        Validators.required,
        this.patternValidatorForName(/\d+/g, { hasNumber: true })
      ])],
      company_name: ['', [Validators.required]],
      company_website: ['', [Validators.required]],
      exhibitor_whatsapp_no: [''],
      exhibitor_whatsapp_no_check: ['', [Validators.required]],
      // blood_group: [''],
      // exhibitor: [''],
      exhibited_before: ['', [Validators.required]],
      is_msme: ['', [Validators.required]],
      msme_type: [''],

      exhibitor_products: ['', [Validators.required]],
      exhibitor_products_other_field: [''],
      marketing_dept_name: [''],
      marketing_dept_whatsapp: [''],
      marketing_dept_designation: [''],
      marketing_dept_email: [''],
      accounts_dept_name: [''],
      accounts_dept_whatsapp: [''],
      accounts_dept_designation: [''],
      accounts_dept_email: [''],
      onsite_dept_name: [''],
      onsite_dept_whatsapp: [''],
      onsite_dept_designation: [''],
      onsite_dept_email: [''],
      address_line1: ['', [Validators.required]],
      address_line2: [''],
      address_pin: ['', [Validators.required]],
      pro_category: ['', [Validators.required]],
      category_other_field: [''],
      mobile_no: ['', [Validators.required]],
      // mobile_no: [{ value: '', disabled: this.numberVerified }, [Validators.required]],
      email: [{ value: '', disabled: this.emailVerified }, [Validators.email]],
      designation: ['', Validators.compose([
        Validators.required,
        this.patternValidatorForName(/\d+/g, { hasNumber: true })
      ])],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      password: ['', Validators.compose([
        Validators.required,
        this.patternValidator(/\d/, { hasNumber: true }),
        this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),

        // 4. check whether the entered password has a lower-case letter
        this.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // 5. check whether the entered password has a special character
        this.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, { hasSpecialCharacters: true }),
        Validators.minLength(8)
      ])],
      cpassword: ['', [Validators.required]],

    }, { validator: this.checkIfMatchingPasswords("password", "cpassword") });
  }
  alphaOnly (e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }
  
  checkIfMatchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value == confirmPassword.value) {
        return;
      } else {
        // this.errorMsg = "Password does not match."
        confirmPassword.setErrors({
          notEqualToPassword: true
        })
      }

    }
  }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): any => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  patternValidatorForName(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): any => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = !regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  otpToken: string = '';
  currentOtpType: String = 'mobile';

  sendOTP(type) {
    this.ngOtpInputRef.setValue('');
    this.otp = ''
    this.numberOTP = 0;
    this.showOtpComponent = !this.showOtpComponent;
    this.currentOtpType = type;

    this.otpLoading = true;
    var field;

    if (type == 'number') {
      this.otpSentTo = this.exhibitorForm.value.mobile_no;
      field = this.exhibitorForm.value.mobile_no;
    }

    if (type == 'email') {
      this.otpSentTo = this.exhibitorForm.value.email;
      field = this.exhibitorForm.value.email;
    }

    // return;
    this._http.postWithoutToken('/otp/generate', {
      // mobile_no : this.exhibitorForm.value.mobile_no,
      field: field,
      type: type,
    }).then(res => {
      this.otpLoading = false;
      res.subscribe((resp: any) => {
        console.log(resp)
        if (resp.status) {
          this.otpToken = resp.token;
          this.otpMessage = resp.message
        } else {
          this.otpErrorMessage = resp.message
        }
      })
    }, err => {
      this.otpLoading = false;
      this.otpErrorMessage = 'Something went wrong'
    })

  }

   isAlphaKey(name: any){
    console.log(name.value)
    let regex: RegExp = /\d+/g
    console.log(regex.test(name.value))
    return regex.test(name.value)
    // console.log('evt', evt)
    // var charCode = (evt.which) ? evt.which : evt.keyCode
    //   if(evt.target.value.length < 10){
    //     if (charCode > 31 && (charCode < 48 || charCode > 57))
    //         return false;
    //       return true;
    //   }
      
    //   return false;
  }

  reSendOTP(type) {

    // this.showOtpComponent = !this.showOtpComponent;

    this.otpLoading = true;

    return;
    this._http.postWithoutToken('/otp/generate', {
      mobile_no: this.exhibitorForm.value.mobile_no,
    }).then(res => {
      this.otpLoading = false;
      res.subscribe((resp: any) => {
        console.log(resp)
        if (resp.status) {
          this.otpToken = resp.token;
          this.otpMessage = resp.message
        } else {
          this.otpErrorMessage = resp.message
        }
      })
    }, err => {
      this.otpLoading = false;
      this.otpErrorMessage = 'Something went wrong'
    })
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  async verifyOtp(type) {
    this.otpLoading = true;

    var field;

    if (type == 'number') {
      this.otpSentTo = this.exhibitorForm.value.mobile_no;
      field = this.exhibitorForm.value.mobile_no;
    }

    if (type == 'email') {
      this.otpSentTo = this.exhibitorForm.value.email;
      field = this.exhibitorForm.value.email;
    }

    this._http.postWithoutToken('/otp/verify', {
      field: field,
      type: type,
      otp: this.otp
    }).then(res => {
      this.loading = false;
      res.subscribe((res: any) => {
        if (res.status) {
          if (type == 'email')
            this.emailVerified = true
          else this.numberVerified = true         
          this.showOtpComponent = !this.showOtpComponent;
          this.otp = ''
          this.numberOTP = undefined
          Swal.fire({
            icon: 'success',
            title: 'OTP verified',
          }).then(() => {
            // this.dialogRef.close(this.data)
          })
        } else {
          this.otpErrorMessage = res.message
        }
      })
    }, err => this.loading = false)

  }

  // async verifyOtp(){
  //   this.loading = true;
  //   this._http.postWithoutToken('/otp/verify', {
  //     field: this.exhibitorForm.value.mobile_no,
  //         token: this.otpToken,
  //     // type :type
  //     otp: this.numberOTP
  //   }).then( res => {
  //     this.loading = false;
  //     res.subscribe( (res:any) => {
  //       if(res.status){
  //         if( this.data.field == 'email')
  //           this.data.emailVerified = true
  //         else this.data.numberVerified = true

  //         Swal.fire({
  //           icon: 'success',
  //           title: 'OTP verified',
  //         }).then( () => {
  //           this.dialogRef.close(this.data)
  //         })
  //       }else{
  //         Swal.fire({
  //           icon: 'error',
  //           title: res.message,
  //         })
  //       }
  //     })
  //   }, err => this.loading = false)

  // }

  async checkEmail(e, control) {
    const email = e.target.value
    if (email == '') return;
    (await this._http.getWithoutToken(`/user/checkEmailWithRole/${email}/exhibitor`)).subscribe((res: any) => {
      if (res.status) {
        control.setErrors({ 'isUnique': true })
      } else {
        return
        // control.setErrors({'isUnique': false})
      }
    })
  }

  async checkMobile(e, control) {
    const email = e.target.value
    if (email == '') return;
    (await this._http.getWithoutToken(`/user/checkMobileWithRole/${email}/exhibitor`)).subscribe((res: any) => {
      if (res.status) {
        control.setErrors({ 'isUnique': true })
      } else {
        return
        // control.setErrors({'isUnique': false})
      }
    })
  }

  chnage_proCategory(e: any) {
    this.selectedProCategory = e.value
    if(e.value.includes("other")){
      if(!this.IsOtherCat && e.value.length > 1){
        this.exhibitorForm.controls['pro_category'].setValue(e.value.filter(x => x != "other"));
      }
      else{ 
        this.IsOtherCat = true;       
        this.exhibitorForm.controls['pro_category'].setValue(["other"]);
      }
    }
    else{
      this.IsOtherCat = false;
      this.exhibitorForm.controls['pro_category'].setValue(e.value.filter(x => x != "other"));
    }
    // this.selectedProCategory.push(e)

  }



  chnage_ProductsCategory(i: any) {
    // console.log(e)
    this.selectedProductCategory = i.value
    console.log(this.selectedProductCategory.toString())
    if(i.value.includes("others")){
      if(!this.IsOtherProd && i.value.length > 1){
        this.exhibitorForm.controls['exhibitor_products'].setValue(i.value.filter(x => x != "others"));
      }
      else{ 
        this.IsOtherProd = true;       
        this.exhibitorForm.controls['exhibitor_products'].setValue(["others"]);
      }
    }
    else{
      this.IsOtherProd = false;
      // e.value.remove("other");
      this.exhibitorForm.controls['exhibitor_products'].setValue(i.value.filter(x => x != "others"));
    }
    //this.exhibitorForm.controls['exhibitor_products'].setValue(this.selectedProductCategory.toString())
  }
  async register() {

    console.log(this.exhibitorForm.getRawValue())
    if (this.exhibitorForm.invalid) {
      return;
    }
    if (!this.numberVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Please verify Mobile'
      })
      return;
    }
    if (!this.emailVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Please verify Email'
      })
      return;
    }
    this.submited = true
    this.loading = true;
    this.exhibitorForm.controls['pro_category'].setValue(this.exhibitorForm.controls['pro_category'].value.toString());
    (await this._http.postWithoutToken('/exhibitor', this.exhibitorForm.getRawValue())).subscribe((res: any) => {
      this.loading = false;
      console.log(res)
      if (res.status) {
        // this.resetForm(this.exhibitorForm)
        // this.exhibitorForm.markAsPristine();
        // this.exhibitorForm.markAsUntouched();
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        //Swal.fire({
          // title: 'Congratulations! You have registered successfully.',
          // icon: 'success',
          // html: 'Please check your registered email id for more details.'
          // 'Our representative will get in touch with you soon.<br>' +
          // 'In the meanwhile <a href="/login">Sign</a> in to submit stall preferences.'
          // ,
          // showCloseButton: false,
          // showCancelButton: true,
          // showConfirmButton: false,
          // focusConfirm: false,
          // confirmButtonText:
          //   '<a style="color:white" href="/login">Sign In</a>',
          // confirmButtonAriaLabel: 'Sign In!',
          // cancelButtonText:
          //   '<a style="color:white"">OK</a>',
          // cancelButtonAriaLabel: 'OK'
        //}).then(() => {
          // window.location.reload()
        //})        
        this.router.navigateByUrl('exhibitor-confirmation');
        this.submited = false;
        // this.exhibitorForm.reset()
      } else {
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  resetForm(form: FormGroup) {

    form.reset();

    Object.keys(form.controls).forEach(key => {
      form.get(key)?.setErrors(null);
    });
  }

  get password() {
    return this.exhibitorForm.get('password');
  }

  reset() {
    this.exhibitorForm.reset();
  }

  onSelectWhatsappNumber(e: any) {

    console.log(typeof (e.value))
    if (e.value === 'true') {
      let mobileNumber = this.exhibitorForm.get('mobile_no')?.value;
      this.wtspNo = true
      this.exhibitorForm.controls['exhibitor_whatsapp_no'].setValue(mobileNumber)
      console.log(e.value)
    } else {
      console.log(e.value)
      this.wtspNo = false
      this.exhibitorForm.controls['exhibitor_whatsapp_no'].reset();
      let ww = this.exhibitorForm.get('exhibitor_whatsapp_no')?.value;
      // console.log(ww)

      // this.exhibitorForm.controls['exhibitor_whatsapp_no'].setValue(null)
    }
  }

  openTremsConditions() {
    console.log(this.exhibitorForm.getRawValue())
    if (this.exhibitorForm.invalid) {
      return;
    }
    if (!this.numberVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Please verify Mobile'
      })
      return;
    }
    if (!this.emailVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Please verify Email'
      })
      return;
    }

    const confirmDialog = this.dialog.open(TermsAndConditionComponent, {
      data: {
        exhibitorData: { exhibitorDetails: this.exhibitorForm.getRawValue() }
      },
      width: '90%',
      height: '98%'


    });
    confirmDialog.afterClosed().subscribe(async (result) => {
      console.log(result);
      if (result == true) {
        this._sb.openSnackBar(result.message, 'OK')
        // this.getDataList(this.userId);
        // (await this._http.delete(`/admin/delete`, admin?.id)).subscribe( (res:any)=> {
        //   if(res.status){
        //     const confirmDialog = this.dialog.open(AppointmentDetailsComponent, {
        //       data: {
        //         message: 'You have succesfully deleted admin ' + admin?.name + '.',
        //         type: 'deleted'
        //       }
        //     });
        //     confirmDialog.afterClosed().subscribe(async (result) => {
        //       // this.getDataList();
        //     })
        //   }else{
        //     this._sb.openSnackBar(res.message, 'OK')
        //   }
        // },(err) => {
        //   this._sb.openSnackBar(err.message, 'OK')
        // })
      }
      // this.getDataList(this.userId);
    });
  }

  openDialog(type): void {
    let value;
    if (type == 'email') value = this.exhibitorForm.value.email
    else value = this.exhibitorForm.value.mobile_no
    const dialogRef = this.dialog.open(OtpComponent, {
      width: '40%',
      data: {
        field: type,
        value: value,
        numberVerified: this.numberVerified,
        emailVerified: this.emailVerified
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.numberVerified = result.numberVerified,
        this.emailVerified = result.emailVerified
      if (this.numberVerified) {
        this.exhibitorForm.get('mobile_no')?.disable({ emitEvent: true })
      }
      if (this.emailVerified) {
        this.exhibitorForm.get('email')?.disable({ emitEvent: true })
      }
    });
  }

  CloseDialog(){
    this.showOtpComponent = !this.showOtpComponent;
  }

  countrySelected(e) {
    const country = e.name
    this.country?.options.forEach((option) => {
      if (country.includes(option.value))
        option.select()
    })
    // let exhibitor:MatSelect = this.exhibitorForm.get('exhibitor');
  }

  stallList: any = [];
  // async getStall() {
  //   (await this._http.getWithoutToken('/stall')).subscribe((res: any) => {
  //     console.log(res);
  //     if (res.status) {
  //       this.stallList = res.data.filter((item: any) => item.exhibitor_id != null);
  //       console.log(this.stallList);
  //       let path: any;



  //       let object: any = document.getElementById('svg-object-registration');
  //       console.log(object?.contentDocument?.getElementById('SA2'));

  //       object.addEventListener("load", (event: any) => {
  //         console.log('loaded')

  //         svgPanZoom('#svg-object-registration', {
  //           zoomEnabled: true,
  //           controlIconsEnabled: true
  //         });

  //         this.stallList.forEach((item: any) => {

  //           let $description = document.getElementById('description');

  //           path = object?.contentDocument?.getElementById('S' + item.stall_no);
  //           // console.log(path)
  //           // set style fill of path
  //           path?.setAttribute('fill', '#F596C7');
  //           path?.setAttribute('data-stall', item.id)
  //           // add event listners for mousehover to path element
  //           path?.addEventListener('mouseover', function (e: any) {
  //             // add class active to path element
  //             path?.setAttribute('class', 'enabled heyo');
  //             $description?.classList.add('active');
  //             if ($description) {
  //               $description.innerHTML = item.stall_no + '(' + item.area + 'm<sup>2</sup>)-' + item.exhibitor.company_name;
  //               $description.style.left = e.pageX + 100 + 'px';
  //               $description.style.top = e.pageY - 30 + 'px';
  //             }
  //           })
  //           path?.addEventListener('mouseout', function (e: any) {
  //             // remove class active from path element
  //             path?.setAttribute('class', 'enabled');
  //             $description?.classList.remove('active');
  //           })

  //         })

  //       });


  //     }
  //   })
  // }



  // ngAfterViewInit() {
  //   // let img = document.getElementsByClassName('ngxImageZoomThumbnail')[0];
  //   // console.log(img.removeAttribute('style'));
  //   console.log('NgAfterViewInit');
  //   this.getStall();
  //   (function ($) {
  //     $(document).ready(function () {
  //       // console.log('I am born ready');
  //       $("#panzoom").panzoom({
  //         $zoomIn: $(".zoom-in"),
  //         $zoomOut: $(".zoom-out"),
  //         $zoomRange: $(".zoom-range"),
  //         $reset: $(".reset"),

  //         contain: 'invert',
  //       });
  //     })
  //   })(jQuery)
  // }
}

