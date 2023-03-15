import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl, FormArray, FormGroupName } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { OtpComponent } from '../exhibitor-register/otp/otp.component';
import { HttpService } from '../services/http.service';
import { SnackBarService } from '../services/snack-bar.service';
import { DelegatePreviewComponent } from './delegate-preview/delegate-preview.component';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment';
import { NgOtpInputConfig } from 'ng-otp-input';

// Razorpay
declare var Razorpay: any;

@Component({
  selector: 'app-delegate-registration',
  templateUrl: './delegate-registration.component.html',
  styleUrls: ['./delegate-registration.component.scss']
})
export class DelegateRegistrationComponent implements OnInit {


  hide = true;
  view =true;

  @ViewChild('country') country: MatSelect
  delegateForm: FormGroup;
  loading: boolean = false;
  submited: boolean;
  type: string = 'individual'
  numberVerified:boolean = false;
  emailVerified:boolean = false;

  config :NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };

  otpLoading:boolean = false;
  otpMessage:string = '';
  otpErrorMessage:string = '';
  otp: string;
  numberOTP: number;
  numberOTPError: any = '';
  otpSentTo: String = '';	

  showOtpComponent = false;

  constructor(
    private _http: HttpService,
    public _sb: SnackBarService,
    private _fb: FormBuilder,
    public dialog: MatDialog
    ) { }

    ngOnInit(): void {
      this.delegateForm = this._fb.group({
        type: ['individual', Validators.required],
        iUnderstand: [false, Validators.required],
        name: ['', Validators.required],
        designation: [''],
        company_name: [''],
        gst: [''],
        mobile_no: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        blood_group: [''],
        category: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        hall: ['', Validators.required],  
        branch : [''],
        organisation : [''],
        // vaccine_certificate: new FormControl('',[Validators.required]),
        // id_certificate: new FormControl('',[Validators.required]),
        // new form controles
        institute : [''],
        district : ['',Validators.required],
        gender : ['',Validators.required],
        day_1 : [false],
        day_2 : [false],
        day_3 : [false],
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

  //   private validateUsername(emailKey: string) {
  //     return (group: FormGroup) => {
  //       let email = this.delegateForm.controls
  //       console.log(email);
  //     }
  // }

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

    // checkEmail(emailKey: string, error: ValidationErrors): ValidatorFn {
    //   return (control: AbstractControl): any => {
    //     let email = control.parent?.get(emailKey);

    //     if (!control.value) {
    //       // if control is empty return no error
    //       return null;
    //     }
    //     let valid = null;
    //     // test the value of the control against the regexp supplied
    //     this._http.get(`/user/checkEmail/${email?.value}`).then( (_sub:any) => {
    //       _sub.subscribe( (res:any) => {
    //         valid = res
    //       })
    //     })

    //     // if true, return no error (no error), else return error passed in the second parameter
    //     return valid ? null : error;
    //   };
    // }

    async checkEmail(e, control){
      const email = e.target.value
      if(email == '') return;
      (await this._http.getWithoutToken(`/user/checkEmailWithRole/${email}/delegate`)).subscribe( (res:any) => {
        if(res.status){
          control.setErrors({'isUnique': true})
        }else{
          return
          // control.setErrors({'isUnique': false})
        }
      })
    }

    async checkMobile(e, control){
      const email = e.target.value
      if(email == '') return;
      (await this._http.getWithoutToken(`/user/checkMobileWithRole/${email}/delegate`)).subscribe( (res:any) => {
        if(res.status){
          control.setErrors({'isUnique': true})
        }else{
          return
          // control.setErrors({'isUnique': false})
        }
      })
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

    get password() {
      return this.delegateForm.get('password');
    }

    delegates(): FormArray {
      return this.delegateForm.get('delegates') as FormArray;
    }

    exactdelegates(){
      let delegates1 =  this.delegates()
        .at(0)
        .get('delegates') as any;
      let delegates2 =  this.delegates()
        .at(1)
        .get('delegates') as any;
      let delegates3 =  this.delegates()
        .at(2)
        .get('delegates') as any;

      let maxDelegate = [delegates1.length, delegates2.length, delegates3.length]
      const max = maxDelegate.reduce((a, b) => Math.max(a, b));
      return max;
    }

    delegateDocument(delegateIndex, Index){
      let delegates =  this.delegates()
      .at(delegateIndex)
      .get('delegates') as FormArray;
      return delegates.at(Index);
    }

    async acceptTerms(e, control){

      const terms = e.checked
      if(terms == true) return;
      else{
        control.setErrors({'accept': true})
      }
    }

    async register(){
      this.submited = true;
      console.log(this.delegateForm.getRawValue())
      console.log(this.delegateForm)
      if(this.delegateForm.invalid){
        console.log('invalid')
        return
      }
      if(!this.delegateForm.value.iUnderstand){
        this.delegateForm.get('iUnderstand')?.setErrors({'accept': true})
        return
      }

      if( !this.numberVerified ){
        Swal.fire({
          icon: 'warning',
          title: 'Please verify Mobile'
        })
        return;
      }
      // if( !this.emailVerified ){
      //   Swal.fire({
      //     icon: 'warning',
      //     title: 'Please verify Email'
      //   })
      //   return;
      // }

      this.submited = true;
      this.loading = true;
      console.log(this.delegateForm.getRawValue());
      ;(await this._http.postWithoutToken('/delegate', this.delegateForm.getRawValue())).subscribe( (res:any) => {
        this.loading = false;
        console.log(res)
        if(res.status){
          this._sb.openSnackBar(res.message, 'OK', 3000)
          Swal.fire({
            title: 'Congratulations! You have registered successfully.',
            icon: 'success',
            html:
              'The QR code has been sent to your registered email id.<br>',
            showCloseButton: false,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              '<i class="fa fa-thumbs-down"></i>OK',
            confirmButtonAriaLabel: 'OK'
          }).then(() => {
            window.location.reload()
          })
          if(res.paymentDetail){
            this.checkout(res.paymentDetail)
          }
        }else{
          this._sb.openSnackBar(res.message, 'OK', 3000)
        }
      }, err => this.loading = false)
    }

    reset(){
      this.delegateForm.reset();
    }

    getDay(index){
        return this.delegates()
          .at(index)
          .get('delegates') as FormArray;
    }

    dayDelegates(empIndex: number): FormArray {
      return this.delegates()
        .at(empIndex).get('delegates') as FormArray
    }

    addDelegate(index:number){
      this.dayDelegates(index).push(this.newDelgate());
    }

    removeDelegate(index: number, i: number) {
      this.dayDelegates(index).removeAt(i);
    }

    formChange(e){
      this.loading = true;
      this.delegateForm.patchValue({
        type: e.value,
      })

      
  

      if( e.value == 'organisation' ){
        this.delegateForm.registerControl('delegates', this.getDelegatesControls())
        this.delegateForm.removeControl('hall');
        this.delegateForm.removeControl('name');
        this.delegateForm.removeControl('designation');
        // this.delegateForm.removeControl('vaccine_certificate');
        // this.delegateForm.removeControl('id_certificate');
        this.delegateForm.get('company_name')?.setValidators(Validators.required)
        this.delegateForm.get('company_name')?.updateValueAndValidity()
        this.delegateForm.get('company_name')?.setErrors({'required': true})
        this.delegateForm.get('gst')?.setValidators(Validators.required)
        this.delegateForm.get('gst')?.updateValueAndValidity()
        this.delegateForm.get('gst')?.setErrors({'required': true})
        // console.log(this.delegates())
        // console.log(this.getDay(0).controls[0]["controls"]["hall"])
        // console.log(this.employeeSkills(0));
      }
      else{
        this.delegateForm.removeControl('delegates')
        this.delegateForm.get('company_name')?.clearValidators()
        this.delegateForm.get('company_name')?.setErrors(null)
        this.delegateForm.get('gst')?.clearValidators()
        this.delegateForm.get('gst')?.setErrors(null)
        this.delegateForm.addControl('hall', new FormControl('', [Validators.required]));
        this.delegateForm.addControl('name', new FormControl('', [Validators.required]));
        this.delegateForm.addControl('designation', new FormControl('', [Validators.required]));
        // this.delegateForm.addControl('vaccine_certificate', new FormControl('', [Validators.required]));
        // this.delegateForm.addControl('id_certificate', new FormControl('', [Validators.required]));
      }

      this.loading = false;
    }

    categoryChange(e){
      this.loading = true;
      this.delegateForm.patchValue({
        category: e.value
      })

      if( e.value == 'Academician/Student' ){
        this.delegateForm.get('organisation')?.clearValidators()
        this.delegateForm.get('designation')?.clearValidators()
        this.delegateForm.get('institute')?.setValidators(Validators.required)
        this.delegateForm.get('branch')?.setValidators(Validators.required)
        // console.log(this.delegates())
        // console.log(this.getDay(0).controls[0]["controls"]["hall"])
        // console.log(this.employeeSkills(0));
      }
      else{
        this.delegateForm.get('organisation')?.setValidators(Validators.required)
        this.delegateForm.get('designation')?.setValidators(Validators.required)
        this.delegateForm.get('institute')?.clearValidators()
        this.delegateForm.get('branch')?.clearValidators()
      }

      this.delegateForm.get('organisation')?.updateValueAndValidity()
      this.delegateForm.get('designation')?.updateValueAndValidity()
      this.delegateForm.get('institute')?.updateValueAndValidity()
      this.delegateForm.get('branch')?.updateValueAndValidity()
      this.loading = false;
    }

    countrySelected(e){
      const country = e.name
      if(this.country?.options.length){
        this.country.options.forEach((option) => {
          if(country.includes(option.value))
            option.select()
        })
      }
    }

    preview(){

        this.dialog.open(DelegatePreviewComponent, {
          hasBackdrop: true,
          data: {
            delegateForm: this.delegateForm.value,
          },
        });

    }



// send otp


  otpToken: string = '';
  currentOtpType: String = 'mobile';

  sendOTP(type){
    this.showOtpComponent = !this.showOtpComponent;
    this.currentOtpType = type;

    this.otpLoading = true;

    var field;

    if(type == 'number'){
      this.otpSentTo = this.delegateForm.value.mobile_no;
      field = this.delegateForm.value.mobile_no;
    }

    if(type == 'email'){
      this.otpSentTo = this.delegateForm.value.email;
      field = this.delegateForm.value.email;
    }

    // return;
    this._http.postWithoutToken('/otp/generate', {
      // mobile_no : this.delegateForm.value.mobile_no,
      field: field,
      type: type, 
    }).then( res => {
      this.otpLoading = false;
      res.subscribe( (resp:any) => {
        console.log(resp)
        if(resp.status){
          this.otpToken = resp.token;
          this.otpMessage = resp.message
        }else{
          this.otpErrorMessage = resp.message
        }
      })
    }, err => {
      this.otpLoading = false; 
      this.otpErrorMessage = 'Something went wrong'
    })

  }


// resend otp


 reSendOTP(type){

  // this.showOtpComponent = !this.showOtpComponent;

  this.otpLoading = true;

  return;
  this._http.postWithoutToken('/otp/generate', {
    mobile_no : this.delegateForm.value.mobile_no,
  }).then( res => {
    this.otpLoading = false;
    res.subscribe( (resp:any) => {
      console.log(resp)
      if(resp.status){
        this.otpToken = resp.token;
        this.otpMessage = resp.message
      }else{
        this.otpErrorMessage = resp.message
      }
    })
  }, err => {
    this.otpLoading = false; 
    this.otpErrorMessage = 'Something went wrong'
  })
}



    // verify otp

    

  onOtpChange(otp) {
    this.otp = otp;
  }

  async verifyOtp(type){
    this.otpLoading = true;

    var field;

    if(type == 'number'){
      this.otpSentTo = this.delegateForm.value.mobile_no;
      field = this.delegateForm.value.mobile_no;
    }

    if(type == 'email'){
      this.otpSentTo = this.delegateForm.value.email;
      field = this.delegateForm.value.email;
    }

    this._http.postWithoutToken('/otp/verify', {
      field: field,
      type: type,
      otp: this.otp
    }).then( res => {
      this.loading = false;
      res.subscribe( (res:any) => {
        if(res.status){
          if( type == 'email')
            this.emailVerified = true
          else this.numberVerified = true
          this.showOtpComponent = false;
          Swal.fire({
            icon: 'success',
            title: 'OTP verified',
          }).then( () => {
            // this.dialogRef.close(this.data)
          })
        }else{
          this.otpErrorMessage = res.message
        }
      })
    }, err => this.loading = false)

  }

    // openDialog(type): void {
    //   let value;
    //   if(type == 'email') value = this.delegateForm.value.email
    //   else value = this.delegateForm.value.mobile_no
    //   const dialogRef = this.dialog.open(OtpComponent, {
    //     width: '40%',
    //     data: {
    //       field: type,
    //       value: value,
    //       numberVerified: this.numberVerified,
    //       emailVerified: this.emailVerified
    //     },
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     console.log(result);
    //     this.numberVerified = result.numberVerified,
    //     this.emailVerified = result.emailVerified

    //     if(this.emailVerified)
    //       this.delegateForm.get('email')?.disable({onlySelf: true})
    //     if(this.numberVerified)
    //       this.delegateForm.get('mobile_no')?.disable({onlySelf: true})
    //   });
    // }

    getDelegatesControls(): AbstractControl {
      return new FormArray([
        // Delegates for Day 1
        new FormGroup({
          day: new FormControl(1),
          delegates: new FormArray([
            new FormGroup({
              hall: new FormControl('',[Validators.required]),
              name: new FormControl('',[Validators.required]),
              designation: new FormControl('',[Validators.required]),
              mobile_no: new FormControl('',[Validators.required]),
              email: new FormControl('',[Validators.required]),
              blood_group: new FormControl('',[Validators.required]),
              // vaccine_certificate: new FormControl('',[Validators.required]),
              // id_certificate: new FormControl('',[Validators.required])
            }),
            // new FormGroup({
            //   hall: new FormControl('',[Validators.required]),
            //   name: new FormControl('',[Validators.required]),
            //   designation: new FormControl('',[Validators.required]),
            //   mobile_no: new FormControl('',[Validators.required]),
            //   email: new FormControl('',[Validators.required]),
            //   blood_group: new FormControl('',[Validators.required]),
            //   // vaccine_certificate: new FormControl('',[Validators.required]),
            //   // id_certificate: new FormControl('',[Validators.required])
            // }),
            // new FormGroup({
            //   hall: new FormControl('',[Validators.required]),
            //   name: new FormControl('',[Validators.required]),
            //   designation: new FormControl('',[Validators.required]),
            //   mobile_no: new FormControl('',[Validators.required]),
            //   email: new FormControl('',[Validators.required]),
            //   blood_group: new FormControl('',[Validators.required]),
            //   // vaccine_certificate: new FormControl('',[Validators.required]),
            //   // id_certificate: new FormControl('',[Validators.required])
            // })
          ])
        }),
        // Delegate for Day 2
        new FormGroup({
          day: new FormControl(2),
          delegates: new FormArray([
            new FormGroup({
              hall: new FormControl('',[Validators.required]),
              name: new FormControl('',[Validators.required]),
              designation: new FormControl('',[Validators.required]),
              mobile_no: new FormControl('',[Validators.required]),
              email: new FormControl('',[Validators.required]),
              blood_group: new FormControl('',[Validators.required]),
              // vaccine_certificate: new FormControl('',[Validators.required]),
              // id_certificate: new FormControl('',[Validators.required])
              category : new FormControl('', [Validators.required])
            }),
            // new FormGroup({
            //   hall: new FormControl('',[Validators.required]),
            //   name: new FormControl('',[Validators.required]),
            //   designation: new FormControl('',[Validators.required]),
            //   mobile_no: new FormControl('',[Validators.required]),
            //   email: new FormControl('',[Validators.required]),
            //   blood_group: new FormControl('',[Validators.required]),
            //   // vaccine_certificate: new FormControl('',[Validators.required]),
            //   // id_certificate: new FormControl('',[Validators.required])
            // }),
            // new FormGroup({
            //   hall: new FormControl('',[Validators.required]),
            //   name: new FormControl('',[Validators.required]),
            //   designation: new FormControl('',[Validators.required]),
            //   mobile_no: new FormControl('',[Validators.required]),
            //   email: new FormControl('',[Validators.required]),
            //   blood_group: new FormControl('',[Validators.required]),
            //   // vaccine_certificate: new FormControl('',[Validators.required]),
            //   // id_certificate: new FormControl('',[Validators.required])
            // })
          ])
        }),
        // Delegate for Dat 3
        new FormGroup({
          day: new FormControl(3),
          delegates: new FormArray([
            new FormGroup({
              hall: new FormControl('',[Validators.required]),
              name: new FormControl('',[Validators.required]),
              designation: new FormControl('',[Validators.required]),
              mobile_no: new FormControl('',[Validators.required]),
              email: new FormControl('',[Validators.required]),
              blood_group: new FormControl('',[Validators.required]),
              // vaccine_certificate: new FormControl('',[Validators.required]),
              // id_certificate: new FormControl('',[Validators.required]),
              category : new FormControl('', [Validators.required])
            }),
            // new FormGroup({
            //   hall: new FormControl('',[Validators.required]),
            //   name: new FormControl('',[Validators.required]),
            //   designation: new FormControl('',[Validators.required]),
            //   mobile_no: new FormControl('',[Validators.required]),
            //   email: new FormControl('',[Validators.required]),
            //   blood_group: new FormControl('',[Validators.required]),
            //   // vaccine_certificate: new FormControl('',[Validators.required]),
            //   // id_certificate: new FormControl('',[Validators.required])
            // }),
            // new FormGroup({
            //   hall: new FormControl('',[Validators.required]),
            //   name: new FormControl('',[Validators.required]),
            //   designation: new FormControl('',[Validators.required]),
            //   mobile_no: new FormControl('',[Validators.required]),
            //   email: new FormControl('',[Validators.required]),
            //   blood_group: new FormControl('',[Validators.required]),
            //   // vaccine_certificate: new FormControl('',[Validators.required]),
            //   // id_certificate: new FormControl('',[Validators.required])
            // })
          ])
        })
      ])
    }

    newDelgate(){
      return new FormGroup({
        hall: new FormControl('',[Validators.required]),
        name: new FormControl('',[Validators.required]),
        designation: new FormControl('',[Validators.required]),
        mobile_no: new FormControl('',[Validators.required]),
        email: new FormControl('',[Validators.required]),
        blood_group: new FormControl('',[Validators.required]),
        // vaccine_certificate: new FormControl('',[Validators.required]),
        // id_certificate: new FormControl('',[Validators.required]),
        category : new FormControl('', [Validators.required])
      });
    }

    copy(e, from, to){
      if( e.checked ){
        console.log(e);
        console.log(from);
        console.log(to);
        // console.log(this.dayDelegates(from));
        // console.log(this.dayDelegates(to));
        const copyFrom = this.dayDelegates(from).controls;
        this.dayDelegates(to).clear();
        copyFrom.forEach( (item) => {
          this.dayDelegates(to).push(item)
        })
        // const copyTo =
        console.log(copyFrom)
        // console.log(copyTo)
      }else{
        this.dayDelegates(to).clear();
        this.addDelegate(to)
        this.addDelegate(to)
        this.addDelegate(to)
      }
    }

    async onFileChange(e, delegateIndex, Index, type){


      const file = e.target.files[0]
      const field = this.delegateDocument(delegateIndex, Index)
      console.log(file);
      var reader = new FileReader();

        reader.readAsDataURL(file); // read file as data url

        reader.onload = async (event) => { // called once readAsDataURL is completed

          const form = new FormData();

          form.append('file', file, file.name)

          ;(await this._http.postWithoutToken('/user/vaccine', form)).subscribe((res:any) => {
            if(res.status){
              // this._sb.openSnackBar(res.message, 'OK', 2000)
              if( type == 'vaccine' ){
                // this.vaccineImageData = event.target?.result;
                field.patchValue({
                  vaccine_certificate: res.url
                })
              }

              if( type == 'id' ){
                // this.idImageData = event.target?.result;
                field.patchValue({
                  id_certificate: res.url
                })
              }
            }else{
              this._sb.openSnackBar(res.message, 'OK', 2000)
            }
          })
        }
    }

    async onFileChange1(e, type){


      const file = e.target.files[0]
      console.log(file);
      var reader = new FileReader();

        reader.readAsDataURL(file); // read file as data url

        reader.onload = async (event) => { // called once readAsDataURL is completed

          const form = new FormData();

          form.append('file', file, file.name)

          ;(await this._http.post('/user/vaccine', form)).subscribe((res:any) => {
            if(res.status){
              // this._sb.openSnackBar(res.message, 'OK', 2000)
              if( type == 'vaccine' ){
                // this.vaccineImageData = event.target?.result;
                this.delegateForm.patchValue({
                  vaccine_certificate: res.url
                })
              }

              if( type == 'id' ){
                // this.idImageData = event.target?.result;
                this.delegateForm.patchValue({
                  id_certificate: res.url
                })
              }
            }else{
              this._sb.openSnackBar(res.message, 'OK', 2000)
            }
          })
        }
    }

    // Razorpay Checkout
    checkout(paymentDetail){
      var options = {
          key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: paymentDetail.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: paymentDetail.currency,
          name: paymentDetail.notes.name,
          description: "Delegate Registration",
          image: "https://example.com/your_logo",
          order_id: paymentDetail.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: function (response){
              // alert(response.razorpay_payment_id);
              // alert(response.razorpay_order_id);
              // alert(response.razorpay_signature)
              // show payment success sweetalert
              Swal.fire({
                icon: 'success',
                title: 'Payment Succesfull!',
                text: 'You have been successfully registered!',
                // footer: '<a href="/login">Sign In</a>'
              }).then(() => {
                window.location.href = '/';
              })
              
          },
          prefill: {
              name: paymentDetail.notes.name,
              email: paymentDetail.notes.email,
              contact: paymentDetail.notes.mobile_no
          },
          notes: paymentDetail.notes,
          theme: {
              "color": "#3399cc"
          }
      };


      var rzp1 = new Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function (response){
              // alert(response.error.code);
              // alert(response.error.description);
              // alert(response.error.source);
              // alert(response.error.step);
              // alert(response.error.reason);
              // alert(response.error.metadata.order_id);
              // alert(response.error.metadata.payment_id);
              Swal.fire({
                icon: 'error',
                title: 'Payment Failed!',
                // text: 'Payment Failed!',
                // footer: '<a href="/login">Sign In</a>'
              })
      });

    }
}
