import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { SnackBarService } from '../services/snack-bar.service';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { OtpComponent } from '../exhibitor-register/otp/otp.component';
import { MatDialog } from '@angular/material/dialog';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable} from 'rxjs';

import {MatStep, MatStepLabel, MatStepper, StepperOrientation} from '@angular/material/stepper';
import { map } from 'rxjs/operators';
import { NgOtpInputConfig } from 'ng-otp-input';

@Component({
  selector: 'app-visitors-registration',
  templateUrl: './visitors-registration.component.html',
  styleUrls: ['./visitors-registration.component.scss']
})
export class VisitorsRegistrationComponent implements OnInit {


  hide = true;
  view =true;
  isLinear: boolean = true;
  stepperOrientation: Observable<StepperOrientation>;
  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild('country') country: MatSelect
  visitorForm: FormGroup;
  loading: boolean = false;
  submited: boolean;
  numberVerified:boolean = false;
  emailVerified:boolean = false;

  isEditable = true;

  visitorFirstStepForm: FormGroup;
  visitorSecondStepForm: FormGroup;
  visitorThirdStepForm: FormGroup;

  otp: string;
  showOtpComponent = false;
  numberOTP: number;
  numberOTPError: any = '';
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

  constructor(
    breakpointObserver: BreakpointObserver,
    private _http: HttpService,
    public _sb: SnackBarService,
    private _fb: FormBuilder,
    public dialog: MatDialog
    ) {
      this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

      // change detector for stepper
      this.stepper?.selectionChange.subscribe(( step:any) => {
        console.log(step)
        // this.matStepperFunc(this.stepper);
        // this.getOemProgress();
      })
     }

    ngOnInit(): void {
      this.visitorForm = this._fb.group({
        iUnderstand: [false, Validators.required],
        company_repName: ['', [Validators.required]],
        company_name: ['', [Validators.required]],
        blood_group: ['', [Validators.required]],
        mobile_no: ['', [Validators.required]],
        email: ['', [Validators.email]],
        designation: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        profession: ['', [Validators.required]],
        vaccine_certificate: ['', [Validators.required]],
        id_certificate: ['', [Validators.required]],
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
        cpassword: ['', [Validators.required]]
      }, { validator: this.checkIfMatchingPasswords("password", "cpassword") });

      this.initializeFirstStepForm();
      this.initializeSecondStepForm();
      this.initializeThirdStepForm();
    }

    initializeFirstStepForm(){
      this.visitorFirstStepForm = new FormGroup({
        company_repName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        mobile_no: new FormControl('', [Validators.required]),
        profession: new FormControl('', [Validators.required]),
        company_name: new FormControl('', [Validators.required]),

      })
    }

    initializeSecondStepForm(){
      this.visitorSecondStepForm = new FormGroup({
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state : new FormControl('', [Validators.required]),
      })
    }

    initializeThirdStepForm(){
      this.visitorThirdStepForm = new FormGroup({
        password: new FormControl('',
          Validators.compose([
            Validators.required,
            this.patternValidator(/\d/, { hasNumber: true }),
            this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),

            // 4. check whether the entered password has a lower-case letter
            this.patternValidator(/[a-z]/, { hasSmallCase: true }),
            // 5. check whether the entered password has a special character
            this.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, { hasSpecialCharacters: true }),
            Validators.minLength(8)
            ])
        ),
        cpassword: new FormControl('', [Validators.required])
      })
    }

    setThirdFormPassword(e, type:string){
      this.visitorThirdStepForm.get(type)?.setValue(e.target.value);
    }

    nextStepper(){
      this.stepper.next();
    }

    prevStepper(){
      this.stepper.previous();
    }

    // check if frist step of stepper
    isFirstStep() {
      return this.stepper?.selectedIndex === 0;
    }

    // check if last step of stepper
    isLastStep() {
      return this.stepper?.selectedIndex === this.stepper?.steps.length - 1;
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

    get password() {
      return this.visitorForm.get('password');
    }

    async acceptTerms(e, control){

      const terms = e.checked
      if(terms == true) return;
      else{
        control.setErrors({'accept': true})
      }
    }



  async register(){
    this.submited = true
    // console.log(this.visitorForm.getRawValue())

    // get current step
    const currentStep = this.stepper.selectedIndex || 0;
    console.log(currentStep)
    // return
    // check form invalid based on current step
    if( currentStep == 0 && this.visitorFirstStepForm.invalid){
      console.log(this.visitorFirstStepForm.getRawValue())
      return;
    }

    if( currentStep == 1 && this.visitorSecondStepForm.invalid){
      console.log(this.visitorSecondStepForm.getRawValue())
      return;
    }

    if( currentStep == 2 && this.visitorThirdStepForm.invalid){
      console.log(this.visitorThirdStepForm.getRawValue())
      return;
    }

    // if(!this.visitorForm.value.iUnderstand){
    //   this.visitorForm.get('iUnderstand')?.setErrors({'accept': true})
    //   return
    // }

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
    this.submited = true
    this.loading = true;
    (await this._http.postWithoutToken('/visitor/stepper-create', {
      ...this.visitorFirstStepForm.getRawValue(),
      ...this.visitorSecondStepForm.getRawValue(),
      ...this.visitorThirdStepForm.getRawValue(),
      currentStep: currentStep + 1,
      token: this.otpToken
    })).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){

        // if(!this.isLastStep()) this.nextStepper()

        this.submited = false;

        if(res.action == 'NEXT_STEP'){
          this.nextStepper()
        }

        if(res.action == 'DONE'){
         Swal.fire({
            title: 'Congratulations! You have registered successfully.',
            icon: 'success',
            html:'The QR code has been sent to your registered email id.'
              // 'Our representative will get in touch with you soon.<br>' +
              // 'In the meanwhile <a href="/login">Sign</a> in to submit stall preferences.'
              ,
            showCloseButton: false,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              '<a style="color:white" href="/login">Sign In</a>',
            confirmButtonAriaLabel: 'Sign In!',
            cancelButtonText:
              '<i class="fa fa-thumbs-down"></i>OK',
            cancelButtonAriaLabel: 'OK'
          })
        }


        // this.resetForm(this.visitorForm)
        // this.visitorForm.markAsPristine();
        // this.visitorForm.markAsUntouched();
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)


      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  resetForm(form: FormGroup) {

      form.reset();

      Object.keys(form.controls).forEach(key => {
        form.get(key)?.setErrors(null) ;
      });
  }





  async checkEmail(e, control){
    const email = e.target.value
    if(email == '') return;
    (await this._http.getWithoutToken(`/user/checkEmailWithRole/${email}/visitor`)).subscribe( (res:any) => {
      if(res.status){
        control.setErrors({'isUnique': true})
      }else{
        return
        // control.setErrors({'isUnique': false})
      }
    })
  }

  async checkMobile(e, control){
    return
    const email = e.target.value
    if(email == '') return;
    (await this._http.getWithoutToken(`/user/checkMobileWithRole/${email}/visitor`)).subscribe( (res:any) => {
      if(res.status){
        control.setErrors({'isUnique': true})
      }else{
        return
        // control.setErrors({'isUnique': false})
      }
    })
  }
  reset(){
    this.visitorForm.reset();
  }

  // openDialog(type): void {
  //   let value;
  //   if(type == 'email') value = this.visitorFirstStepForm.value.email
  //   else value = this.visitorFirstStepForm.value.mobile_no
  //   const dialogRef = this.dialog.open(OtpComponent, {
  //     width: '250px',
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

  //     if( this.numberVerified ){
  //       this.visitorForm.get('mobile_no')?.disable({onlySelf: true})
  //     }
  //     if( this.emailVerified ){
  //       this.visitorForm.get('email')?.disable({onlySelf: true})
  //     }

  //   });
  // }

  otpToken: string = '';

  sendOTP(type){
    this.showOtpComponent = !this.showOtpComponent;

    this.otpLoading = true;

    this._http.postWithoutToken('/visitor/stepper-otp', {
      mobile_no: this.visitorFirstStepForm.value.mobile_no,
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

  reSendOTP(type){

    this.otpLoading = true;

    this._http.postWithoutToken('/visitor/stepper-otp', {
      mobile_no: this.visitorFirstStepForm.value.mobile_no,
    }).then( res => {
      this.otpLoading = false;
      res.subscribe( (resp:any) => {
        console.log(resp)
        if(resp.status){
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

  async verifyOtp(){
    this.loading = true;
    this._http.postWithoutToken('/visitor/stepper-otp-verify', {
      field: this.visitorFirstStepForm.value.mobile_no,
      token: this.otpToken,
      otp: this.otp
    }).then( res => {
      this.loading = false;
      res.subscribe( (res:any) => {
        if(res.status){
          this.numberVerified = true
          this.showOtpComponent = false;

          this.visitorFirstStepForm.get('mobile_no')?.disable({emitEvent: true})

          if(res.action == 'VERIFIED'){
            Swal.fire({
              icon: 'success',
              title: res.message,
            }).then( () => {
              this.showOtpComponent = false;
            })
          }

          if(res.action == 'DATA_FOUND'){
            Swal.fire({
              title: res.message.title,
              text: res.message.message,
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, Continue!'
            }).then((result) => {
              this.showOtpComponent = false;
              if (result.isConfirmed) {
                this.visitorFirstStepForm.patchValue({
                  company_repName: res.data.company_repName,
                  email: res.data.email,
                  profession: res.data.profession,
                  company_name: res.data.company_name,
                })

                this.visitorSecondStepForm.patchValue({
                  country: res.data.country,
                  city: res.data.city,
                  state : res.data.state,
                })

                this.visitorThirdStepForm.reset();
              }
            })
          }

        }else{
          this.otpErrorMessage = res.message
        }
      })
    }, err => this.loading = false)

  }

  ngAfterViewInit(){
    this.visitorThirdStepForm.reset();
  }

  countrySelected(e){
    const country = e.name
    this.country?.options.forEach((option) => {
      if(country.includes(option.value))
        option.select()
    })
  }

  vaccineImageData:any;
  idImageData:any;
  async onFileChange(e, type){
    const file = e.target.files[0]
    console.log(file);
    var reader = new FileReader();

      reader.readAsDataURL(file); // read file as data url

      reader.onload = async (event:any) => { // called once readAsDataURL is completed

        const form = new FormData();

        form.append('file', file, file.name)

        ;(await this._http.postWithoutToken('/user/vaccine', form)).subscribe((res:any) => {
          if(res.status){
            // this._sb.openSnackBar(res.message, 'OK', 2000)
            if( type == 'vaccine' ){
              this.vaccineImageData = event.target?.result;
              this.visitorForm.patchValue({
                vaccine_certificate: res.url
              })
            }

            if( type == 'id' ){
              this.idImageData = event.target?.result;
              this.visitorForm.patchValue({
                id_certificate: res.url
              })
            }
          }else{
            this._sb.openSnackBar(res.message, 'OK', 2000)
          }
        })
      }
  }

  // generate todays date
  // getDate(){
  //   const date = new Date();
  //   const year = date.getFullYear();
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  //   return `${year}-${month}-${day}`
  // }

  onOtpChange(otp) {
    this.otp = otp;
  }



}
