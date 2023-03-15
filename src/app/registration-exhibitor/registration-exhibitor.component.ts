import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
} from '@angular/forms';
import { HttpService } from '../services/http.service';
import { SnackBarService } from '../services/snack-bar.service';
import {
  pan,
  zoom,
  getScale,
  setScale,
  resetScale,
} from 'svg-pan-zoom-container';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  StepperOrientation,
} from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { OtpComponent } from '../exhibitor-register/otp/otp.component';
import { MatSelect } from '@angular/material/select';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
declare var jQuery: any;

@Component({
  selector: 'app-registration-exhibitor',
  templateUrl: './registration-exhibitor.component.html',
  styleUrls: ['./registration-exhibitor.component.scss'],
})
export class RegistrationExhibitorComponent implements OnInit {
  @ViewChild('country') country: MatSelect;
  @ViewChild('phone') phone: NgxMatIntlTelInputComponent;
  stepperOrientation: Observable<StepperOrientation>;
  @ViewChild('matStepper') stepper!: MatStepper;

  otp: string;
  showOtpComponent = false;
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput:NgOtpInputComponent;
  config :NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };

  exhibitorForm: FormGroup;
  exhibitorForm2: FormGroup;
  exhibitorForm3: FormGroup;
  
  isLinear: boolean = false; //true
  currentForm: any;
  selectedIndex = 0;
  loading: boolean = false;
  submited: boolean = false;
  type;
  numberVerified: boolean = false;
  emailVerified: boolean = false;
  numberOTP: number;
  numberOTPError: any = '';
  image = '../../assets/BI22-Latest-Exhibition-Floor-plan.jpg';
  constructor(
    breakpointObserver: BreakpointObserver,
    private _http: HttpService,
    public _sb: SnackBarService,
    private _fb: FormBuilder,
    public dialog: MatDialog
  ) {
    
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    // change detector for stepper
    this.stepper?.selectionChange.subscribe(() => {
      this.matStepperFunc(this.stepper);
    });
  }

  ngOnInit(): void {
 
    this.exhibitorForm = this._fb.group(
      {
        company_repName: ['', [Validators.required]],
        company_name: ['', [Validators.required]],
        blood_group: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        }
    );
    this.exhibitorForm2 = this._fb.group(
      {
        mobile_no: [
          { value: '', disabled: this.numberVerified },
          [Validators.required],
        ],
        email: [
          { value: '', disabled: this.emailVerified },
          [Validators.email],
        ],
      }
        );
        this.exhibitorForm3 = this._fb.group(
          {
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            country: ['', [Validators.required]],
            password: [
              '',
              Validators.compose([
                Validators.required,
                this.patternValidator(/\d/, { hasNumber: true }),
                this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
    
                // 4. check whether the entered password has a lower-case letter
                this.patternValidator(/[a-z]/, { hasSmallCase: true }),
                // 5. check whether the entered password has a special character
                this.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, {
                  hasSpecialCharacters: true,
                }),
                Validators.minLength(8),
              ]),
            ],
            cpassword: ['', [Validators.required]],
            // exhibitor: ['', [Validators.required]],
            pro_category: ['', [Validators.required]],
          },
          { validator: this.checkIfMatchingPasswords('password', 'cpassword') }
        );
  }
  matStepperFunc(e: any) {
    console.log(e.selectedStep);
    this.currentForm = e.selectedStep.label;
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
          notEqualToPassword: true,
        });
      }
    };
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

  async checkEmail(e, control) {
    const email = e.target.value;
    if (email == '') return;
    (await this._http.getWithoutToken(`/user/checkEmail/${email}`)).subscribe(
      (res: any) => {
        if (res.status) {
          control.setErrors({ isUnique: true });
        } else {
          return;
          // control.setErrors({'isUnique': false})
        }
      }
    );
  }

  async checkMobile(e, control) {
    const email = e.target.value;
    if (email == '') return;
    (await this._http.getWithoutToken(`/user/checkMobile/${email}`)).subscribe(
      (res: any) => {
        if (res.status) {
          control.setErrors({ isUnique: true });
        } else {
          return;
          // control.setErrors({'isUnique': false})
        }
      }
    );
  }

  async register() {
  console.log(
    {
      company_repName: this.exhibitorForm.value.company_repName,
      company_name: this.exhibitorForm.value.company_name,
      blood_group: this.exhibitorForm.value.blood_group,
      designation: this.exhibitorForm.value.designation,
      mobile_no: this.exhibitorForm2.value.mobile_no,
      email: this.exhibitorForm2.value.email,
      city: this.exhibitorForm3.value.city,
      state: this.exhibitorForm3.value.state,
      country: this.exhibitorForm3.value.country,
      password: this.exhibitorForm3.value.password,
      cpassword: this.exhibitorForm3.value.cpassword,
      pro_category: this.exhibitorForm3.value.pro_category,
    },
  )
    if (this.exhibitorForm3.invalid) {
      return;
    }
    // if (!this.numberVerified) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Please verify Mobile',
    //   });
    //   return;
    // }
    // if (!this.emailVerified) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Please verify Email',
    //   });
    //   return;
    // }
    this.submited = true;
    this.loading = true;
    (
      await this._http.postWithoutToken(
        '/exhibitor',
        {
          company_repName: this.exhibitorForm.value.company_repName,
          company_name: this.exhibitorForm.value.company_name,
          blood_group: this.exhibitorForm.value.blood_group,
          designation: this.exhibitorForm.value.designation,
          mobile_no: this.exhibitorForm2.value.mobile_no,
          email: this.exhibitorForm2.value.email,
          city: this.exhibitorForm3.value.city,
          state: this.exhibitorForm3.value.state,
          country: this.exhibitorForm3.value.country,
          password: this.exhibitorForm3.value.password,
          cpassword: this.exhibitorForm3.value.cpassword,
          pro_category: this.exhibitorForm3.value.pro_category,
        },
      )
    ).subscribe((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.status) {
        Swal.fire({
          title: 'Registration Succesful!',
          icon: 'success',
          html:
            'Our representative will get in touch with you soon.<br>' +
            'In the meanwhile <a href="/login">Sign</a> in to submit stall preferences.',
          showCloseButton: false,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: '<a style="color:white" href="/login">Sign In</a>',
          confirmButtonAriaLabel: 'Sign In!',
          cancelButtonText: '<i class="fa fa-thumbs-down"></i>OK',
          cancelButtonAriaLabel: 'OK',
        }).then(() => {
          window.location.reload();
        });
        this.submited = false;
      } else {
        this._sb.openSnackBar(res.message, 'OK', 3000);
      }
    });
  }

  resetForm(form: FormGroup) {
    form.reset();

    Object.keys(form.controls).forEach((key) => {
      form.get(key)?.setErrors(null);
    });
  }

  get password() {
    return this.exhibitorForm3.get('password');
  }

  reset() {
    this.exhibitorForm.reset();
    this.exhibitorForm2.reset();
    this.exhibitorForm3.reset();
  }

  verifyNumber() {}

  openDialog(type): void {


    this.showOtpComponent = !this.showOtpComponent;
    // this.toggleDisable();



    return
    let value;
    if (type == 'email') value = this.exhibitorForm2.value.email;
    else value = this.exhibitorForm2.value.mobile_no;
    const dialogRef = this.dialog.open(OtpComponent, {
      // width: '250px',
      data: {
        field: type,
        value: value,
        emailVerified: this.emailVerified,
        numberVerified: this.numberVerified,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
      (this.numberVerified = result.numberVerified),
        (this.emailVerified = result.emailVerified);
      if (this.numberVerified) {
        this.exhibitorForm2.get('mobile_no')?.disable({ emitEvent: true });
      }
      if (this.emailVerified) {
        this.exhibitorForm2.get('email')?.disable({ emitEvent: true });
      }
    });
  }

  countrySelected(e) {
    const country = e.name;
    this.country?.options.forEach((option) => {
      if (country.includes(option.value)) option.select();
    });
  }

  stallList: any = [];
  async getStall() {
    (await this._http.getWithoutToken('/stall')).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        this.stallList = res.data.filter(
          (item: any) => item.exhibitor_id != null
        );
        console.log(this.stallList);
        let path: any;

        let object: any = document.getElementById('svg-object-registration');
        console.log(object?.contentDocument?.getElementById('SA2'));

        object.addEventListener('load', (event: any) => {
          console.log('loaded');

          this.stallList.forEach((item: any) => {
            let $description = document.getElementById('description');

            path = object?.contentDocument?.getElementById('S' + item.stall_no);
            // console.log(path)
            // set style fill of path
            path?.setAttribute('fill', '#F596C7');
            path?.setAttribute('data-stall', item.id);
            // add event listners for mousehover to path element
            path?.addEventListener('mouseover', function (e: any) {
              // add class active to path element
              path?.setAttribute('class', 'enabled heyo');
              $description?.classList.add('active');
              if ($description) {
                $description.innerHTML =
                  item.stall_no +
                  '(' +
                  item.area +
                  'm<sup>2</sup>)-' +
                  item.exhibitor.company_name;
                $description.style.left = e.pageX + 100 + 'px';
                $description.style.top = e.pageY - 30 + 'px';
              }
            });
            path?.addEventListener('mouseout', function (e: any) {
              // remove class active from path element
              path?.setAttribute('class', 'enabled');
              $description?.classList.remove('active');
            });
          });
        });
      }
    });
  }

  ngAfterViewInit() {
    console.log('NgAfterViewInit');
    this.getStall();
    (function ($) {
      $(document).ready(function () {
        console.log('I am born ready');
        $('#panzoom').panzoom({
          $zoomIn: $('.zoom-in'),
          $zoomOut: $('.zoom-out'),
          $zoomRange: $('.zoom-range'),
          $reset: $('.reset'),
          contain: 'invert',
        });
      });
    })(jQuery);
  }



  // OTP FUnctions

  toggleDisable(){
    if(this.ngOtpInput.otpForm){
      if(this.ngOtpInput.otpForm.disabled){
        this.ngOtpInput.otpForm.enable();
      }else{
        this.ngOtpInput.otpForm.disable();
      }
    }
  }
  
  onOtpChange(otp) {
    this.otp = otp;
  }
}
