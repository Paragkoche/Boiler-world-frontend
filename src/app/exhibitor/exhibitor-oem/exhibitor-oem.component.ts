import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild,  } from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatStep, MatStepLabel, MatStepper, StepperOrientation} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, PatternValidator, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { HttpEventType } from '@angular/common/http';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { ViewimageComponent } from '../viewimage/viewimage.component';


@Component({
  selector: 'app-exhibitor-oem',
  templateUrl: './exhibitor-oem.component.html',
  styleUrls: ['./exhibitor-oem.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],

})


export class ExhibitorOemComponent implements OnInit {
  
  
  @ViewChild('print_participation_section') print_participation_section: ElementRef;
  @ViewChild('health_undertaking_section') health_undertaking_section: ElementRef;
  stepperOrientation: Observable<StepperOrientation>;
  CATALOGUE_ENTRY: FormGroup;
  HOST_and_HOSTESS: FormGroup;
  USER_PROFILE: FormGroup;
  POWER_REQUIREMENT: FormGroup;
  INDEMNITY_UNDERTAKING: FormGroup;
  VISA_INVITATION_LETTER: FormGroup;
  EXHIBITOR_DELIVERABLES: FormGroup;
  BOOTH_CONTRACTOR_AUTHORISATION: FormGroup;
  BOOTH_CONTRACTOR_AUTHORISATION_1: FormGroup;
  BARE_SPACE_AND_STALL_DESIGN_APPROVAL: FormGroup;
  user: any;
  uploadStart: boolean;
  file: any;
  progress: number;
  isVisaApplicable: boolean = false;
  isBootApplicable: boolean = false;
  isFurnitureApplicable: boolean = false;
  isCatalogueApplicable : boolean = false;
  isHealthApplicable : boolean = false;
  isBareApplicable : boolean = false;
  isUserProfileApplicable : boolean = false

  isLinear: boolean = false; //true
  @ViewChild("fascia") fascia: ElementRef;
  fasciaLength: any;
  @ViewChild('matStepper') stepper!: MatStepper;
  currentForm : any = 'USER PROFILE';
  vendorList: any;
  vendorProduct: any;
  selectedProduct: any = [];
  subTotal: number = 0;
  fasciaValue: any;
  gst: number = 0;
  total: number = 0;
  HEALTH_UNDERTAKING: FormGroup;
  PARTICIPATION_FORM: FormGroup;
  stallDesignFile: any;
  _subscription: any;

  myStall:any = [];
  myStallDimensionA:any = [];
  myStallDimensionB:any = [];
  myStallType:any = [];
  myStallHeightRestriction:any = [];
  myStallArea: any = [];
  myStallBadges: any;
  myStallExtraBadges: any=[];
  myStallCoupons: any;
  myStallFoodCoupons: any=[];
  myStallWidth: any=[];
  myStallLength: any[];
  myStallHeight: any = [];
  myStallTable: any = [];
  // myStallCompanyName: any[];
  myStallChair: any = [];
  myStallDustbin: any = [];
  myStallPowerSocket: any = [];
  myStallSpotlight: any = [];
  EXHIBITOR_BADGES: any = [];
  myStallExtraFoodCoupons: any = [];

  selectedIndex = 0;
  passport_image: any;

  // OEM form varialbes

  oem_user_profile:boolean = false


  wordCount: any;
  @ViewChild("text") text: ElementRef;
  
  constructor(
    breakpointObserver: BreakpointObserver,
    private _fb: FormBuilder,
    private _http: HttpService,
    public _sb: SnackBarService,
    private _auth: AuthService,
    public dialog: MatDialog,
  ) {
    // this.refreshToken()
    this._auth.refreshToken1();
    this._subscription = this._auth.dataValueChange.subscribe((value) => {
      console.log(value)
      this.user = value

      console.log('user profile', this.user.oem_user_profile);
      console.log('user profile', this.oem_user_profile);

      // OEM status set
      this.oem_user_profile = this.user.oem_user_profile ? true : false

      console.log('user profile', this.user.oem_user_profile);
      console.log('user profile', this.oem_user_profile);

      this.selectedIndex = this.user?.currentFormIndex;
      
      this.currentForm = this.user?.currentForm;
      this.isBootApplicable = !this.user?.booth_contractor_applicable;
      this.isFurnitureApplicable = !this.user?.furniture_applicable;
      this.isBootApplicable = this.user?.booth_contractor_applicable;
      console.log('boot', this.isBootApplicable)
      this.isVisaApplicable = !this.user?.visa_applicable;
      this.fasciaValue = this.fascia.nativeElement.value = this.user.fascia
      this.init_all_forms();
    });
    
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

      // change detector for stepper
      this.stepper?.selectionChange.subscribe(( step:any) => {
        console.log(step)
        this.matStepperFunc(this.stepper);
        this.getOemProgress();
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
   

   async refreshToken(){
     this._sb.openSnackBar('Refreshing Data...', 'Close');
     (await (this._auth.refreshToken())).subscribe((res: any) => {
      if (res.status) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.data))
      }
      this.init_all_forms();
      this._sb.openSnackBar('Data Refreshed!', 'OK');
    })
   }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    this.user = userJson !== null ? JSON.parse(userJson) : {};
    this.selectedIndex = this.user?.currentFormIndex;
    this.currentForm = this.user?.currentForm;
    this.isBootApplicable = !this.user?.booth_contractor_applicable;
    this.isFurnitureApplicable = !this.user?.furniture_applicable;
    this.isVisaApplicable = !this.user?.visa_applicable;
    this.init_all_forms();

  }
  
  openDialog(image) {
    const dialogRef = this.dialog.open(ViewimageComponent,{
      data:image
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  init_all_forms(){
    this.init_CATALOGUE_ENTRY_FORM();
    this.init_HOST_and_HOSTESS_FORM();
    this.init_USER_PROFILE_FORM();
    this.init_EXHIBITOR_BADGES_FORM();
    this.init_POWER_REQUIREMENT_FORM();
    this.init_INDEMNITY_UNDERTAKING_FORM();
    this.init_HEALTH_UNDERTAKING_FORM();
    this.init_VISA_INVITATION_LETTER_FORM();
    this.init_EXHIBITOR_DELIVERABLES_FORM();
    this.init_BOOTH_CONTRACTOR_AUTHORISATION_FORM();
    this.init_BOOTH_CONTRACTOR_AUTHORISATION_1_FORM();
    this.init_PARTICIPATION_FORM();
    this.init_BARE_SPACE_AND_STALL_DESIGN_APPROVAL_FORM();
    this.getUser();
    // this.matStepperFunc();
    this.getVendor();
  }


  words: any;
  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }

  async matStepperFunc(e:any){
    this.init_all_forms()
    console.log(e.selectedIndex);
    this.currentForm = e.selectedStep.label;

    if(e.selectedStep.label == 'VISA INVITATION LETTER'){
      this.init_VISA_INVITATION_LETTER_FORM();
    }

    if(e.selectedStep.label == 'CATALOGUE ENTRY'){
      this.init_CATALOGUE_ENTRY_FORM();
      this.CATALOGUE_ENTRY.patchValue({
        name_of_organisation: this.user.company_name,
        city: this.user.city,
        country: this.user.country,
        contact_person: this.user.contact_person || this.user.company_repName,
        catalogue_mobile_no: this.user.catalogue_mobile_no || this.user.mobile_no,
        catalogue_email: this.user.catalogue_email || this.user.email,
        contact_person_designation: this.user.contact_person_designation || this.user.designation,
        company_profile: this.user.company_profile,
        company_logo: this.user.company_logo,
        address_line1: this.user.address_line1,
        address_line2: this.user.address_line2,
        address_line3: this.user.address_line3,
        website: this.user.website,
        post_code: this.user.post_code,
        booth_no: this.myStall
      })
    }
    if(e.selectedStep.label == 'PARTICIPATION LETTER'){
      this.getOemProgress();
    }

    if(e.selectedStep.label == 'HOST & HOSTESS'){
      this.getHostSetting();
    }

    // update current editing form
    (await
      // update current editing form
      this._http.post('/oem/currentForm', {
        currentForm: this.currentForm,
        currentFormIndex: e.selectedIndex
      })).subscribe((res: any) => {
        this._auth.refreshToken1();
      console.log(res);
    })
  }
  fasciaChange(){
    // console.log(this.fascia_name.nativeElement.value);
    this.fasciaLength = this.fascia.nativeElement.value.length
    this.fasciaValue = this.fascia.nativeElement.value

  }

  print_participation_form(): void {
    let printContents, popupWin;
    printContents = this.print_participation_section.nativeElement.innerHTML;
    // set A4 paper size
    let A4_width = 210;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto,size=auto,margin=10%');
    // popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>&nbsp;</title>
          <style>
            @media print{
             
              @page {
                size: auto;
                margin: 0;
              }
          
            }
           
          </style>
        </head>
        <body onload="window.print();">
            <div style="position: relative">
              <img style="position: absolute; left:0; right:0; top:0; bottom:0; height:297mm; width:210mm; z-index:9999;" src="../../../assets/latter.png" />
              <div style="position: absolute; left:0; right:0; top:0; bottom:0; height:auto; width:170mm; padding-top:150px; padding-bottom:130px; padding-left:75px; padding-right:75px; z-index:10000;">
                ${printContents}
              </div>
            </div>
        </body>
   
      </html>`
    );
    popupWin.document.close();
  }

  print_health_undertaking_section(): void {
    let printContents, popupWin;
    printContents = document.getElementById('health_undertaking_section');
    console.log(printContents);
    // return  ${printContents.innerHTML}
    popupWin = window.open('', 'Health Undertaking', 'top=0,left=0,height=100%,width=auto,size=auto,margin=0mm');
    // popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>&nbsp;</title>
          <style>
        
          </style>
        </head>
        <body onload="window.print();">
       
       

        <div role="list">
          <p>I &nbsp; <span contenteditable="true">${ this.user.company_repName }</span> &nbsp; resident of &nbsp; <span
              contenteditable="true">${ this.user.city }</span> &nbsp; ,do hereby, declare the following:</p>

          <p>1. That, I have read the Instructions, Guidelines, and relevant orders about COVID-19
              pandemic. I have read Information Bulletin, Instructions, and Notices related to the
              covid-19 appropriate behaviour at the venue.</p>
          <p>
              2. I have in the last 14 days experienced(please tick, wherever it applies to you, otherwise
              leave blank):
          </p>

          <p class="ml-3">
            The following flu-like symptoms:
          </p>
          <p class="ml-3">&nbsp;
              Fever: &nbsp;<input type="checkbox"
              formControlName="fever" ${ this.HEALTH_UNDERTAKING.value.fever? 'checked': '' }>&nbsp; 
              Cough:&nbsp; <input type="checkbox"
              formControlName="cough" ${ this.HEALTH_UNDERTAKING.value.cough? 'checked': '' }>&nbsp; 
              Breathlessness:<input type="checkbox"
              ${ this.HEALTH_UNDERTAKING.value.breathlessness? 'checked': '' }
              formControlName="breathlessness">&nbsp; Sore Throat:&nbsp;<input type="checkbox"
              ${ this.HEALTH_UNDERTAKING.value.sore_throat_running_nose? 'checked': '' }
              formControlName="sore_throat_running_nose" ${ this.HEALTH_UNDERTAKING.value.running_nose? 'checked': '' }>&nbsp;Running
              Nose:&nbsp;
              <input type="checkbox" formControlName="sore_throat_running_nose" ${ this.HEALTH_UNDERTAKING.value.sore_throat_running_nose? 'checked': '' }> &nbsp;Body ache:&nbsp; <input
                  type="checkbox" formControlName="body_ache" ${ this.HEALTH_UNDERTAKING.value.body_ache? 'checked': '' }>
          </p>
            
          <p class="ml-3">
              <p class="mr-2"> Others- Please specify: <span contenteditable="true"
                  (keyup)="checkcontent($event)"> ${ this.HEALTH_UNDERTAKING.value.other_symptom }</span></p>
          </p>
          <p class="ml-3">
            <p>a)<input type="checkbox" formControlName="option_a" ${ this.HEALTH_UNDERTAKING.value.option_a? 'checked': '' }> been in close contact with a confirmed case of the COVID-19. (
          'Close contact' means being at less than one meter for more than 15 minutes) </p> 
    
          </p>


          <p class="ml-3">
              <p>b) <input type="checkbox" formControlName="option_b" ${ this.HEALTH_UNDERTAKING.value.option_b? 'checked': '' }> not been in close contact with a person suffering from COVID-19
                  and am NOT under mandatory quarantine
              </p>
          </p>


          <p>
              <p> 4. I/ we have read the detailed guidelines <span
                  class="blue"><a href="https://arogya.maharashtra.gov.in/1175/Novel--Corona-Virus">https://arogya.maharashtra.gov.in/1175/Novel--Corona-Virus</a> </span> and I/
              we undertake to abide by the same.</p>
          </p>




      </div>

      <p>
          <input type="checkbox" formControlName="option_b" ${ this.HEALTH_UNDERTAKING.value.health_undertaking_accepted? 'checked': '' }> I Accept
      </p>

        </body>
   
      </html>`
    );
    popupWin.document.close();
  }

  resetFascia(){
    this.fascia.nativeElement.value = '';
    this.fasciaLength = this.fascia.nativeElement.value.length
  }

  ngAfterViewInit(){
    this.fascia.nativeElement.value = this.user.fascia
    this.fasciaLength = this.fascia.nativeElement.value.length
    this.wordCounter()
  }

  getUser(){
    const userJson = localStorage.getItem('user');
    this.user = userJson !== null ? JSON.parse(userJson) : {};
    this.selectedIndex = this.user?.currentFormIndex;
    this.currentForm = this.user?.currentForm;
    this.isBootApplicable = !this.user?.booth_contractor_applicable;
    this.isFurnitureApplicable = !this.user?.furniture_applicable;
    this.isVisaApplicable = !this.user?.visa_applicable;
    this.myStall = [];
    this.myStallType = [];
    this.myStallDimensionA = [];
    this.myStallDimensionB = [];
    this.myStallArea = [];
    this.myStallBadges = [];
    this.myStallExtraBadges = [];
    this.myStallFoodCoupons = [];
    this.myStallExtraFoodCoupons = [];
    this.myStallHeightRestriction = [];
    this.myStallWidth =[];
    this.myStallLength = [];
    this.myStallHeight = [];

    this.myStallTable = [];
    this.myStallChair = [];
    this.myStallPowerSocket = [];
    this.myStallDustbin = [];
    this.myStallSpotlight = [];
    // this.myStallCompanyName = [];

    this.user?.stall.forEach(stall => {
      this.myStall.push(stall.stall_no);
      this.myStallType.push(stall.stall_type);
      this.myStallDimensionA.push(stall.length);
      this.myStallDimensionB.push(stall.width);
      this.myStallArea.push(stall.area);
      this.myStallHeightRestriction.push(stall.height);
      this.myStallWidth.push(stall.width);
      this.myStallBadges.push(stall.number_of_bagdes);
      this.myStallExtraBadges.push(stall.extra_badges);
      this.myStallFoodCoupons.push(stall.number_food_coupons);
      this.myStallExtraFoodCoupons.push(stall.extra_food_coupons);

      this.myStallTable.push(stall.table)
      this.myStallChair.push(stall.chair)
      this.myStallPowerSocket.push(stall.power_socket)
      this.myStallDustbin.push(stall.dustbin)
      this.myStallSpotlight.push(stall.spotlight)
    });

    // sum all integer in array
    this.myStallArea = this.myStallArea.reduce((a, b) => a + b, 0);
    this.myStallDimensionA = this.myStallDimensionA.reduce((a, b) => a + b, 0);
    this.myStallDimensionB = this.myStallDimensionB.reduce((a, b) => a + b, 0);
    // Add all table from array of stall
    this.myStallTable = this.myStallTable.reduce((a, b) => a + b, 0);
    this.myStallChair = this.myStallChair.reduce((a, b) => a + b, 0);
    this.myStallPowerSocket = this.myStallPowerSocket.reduce((a, b) => a + b, 0);
    this.myStallDustbin = this.myStallDustbin.reduce((a, b) => a + b, 0);
    this.myStallSpotlight = this.myStallSpotlight.reduce((a, b) => a + b, 0);
    this.myStallBadges = this.myStallBadges.reduce((a, b) => a + b, 0);
    this.myStallExtraBadges = this.myStallExtraBadges.reduce((a, b) => a + b, 0);
    this.myStallFoodCoupons = this.myStallFoodCoupons.reduce((a, b) => a + b, 0);
    this.myStallExtraFoodCoupons = this.myStallExtraFoodCoupons.reduce((a, b) => a + b, 0);
    // gett largest integer in array
    this.myStallHeightRestriction = Math.max(...this.myStallHeightRestriction);
    

    this.CATALOGUE_ENTRY.patchValue({
      name_of_organisation: this.user.company_name,
      city: this.user.city,
      country: this.user.country,
      contact_person: this.user.contact_person || this.user.company_repName,
      catalogue_mobile_no: this.user.catalogue_mobile_no || this.user.mobile_no,
      catalogue_email: this.user.catalogue_email || this.user.email,
      contact_person_designation: this.user.contact_person_designation || this.user.designation,
      company_profile: this.user.company_profile,
      company_logo: this.user.company_logo,
      address_line1: this.user.address_line1,
      address_line2: this.user.address_line2,
      address_line3: this.user.address_line3,
      website: this.user.website,
      post_code: this.user.post_code,
      booth_no: this.myStall
    })

    this.HOST_and_HOSTESS.patchValue({
      host_qty: this.user.host_qty,
      hostess_qty: this.user.hostess_qty
    })

    // split name on space

    this.USER_PROFILE.patchValue({
      title: this.user.title,
      company_logo: this.user.company_logo,
      company_name: this.user.company_name,
      company_repName: this.user.company_repName,
      first_name: this.user.company_repName.split(' ')[0],
      last_name: this.user.company_repName.split(' ')[1],
      email: this.user.email,
      alternative_email: this.user.alternative_email,
      mobile_no: this.user.mobile_no,
      address_line1: this.user.address_line1,
      address_line2: this.user.address_line2,
      address_line3: this.user.address_line3,
      post_code: this.user.post_code,
      city: this.user.city,
      country: this.user.country,
      state: this.user.state,
      website: this.user.website,
      booth_number: this.myStall,
      booth_type: this.myStallType,
      booth_size: this.myStallArea,
      dimension_a: this.myStallDimensionA,
      dimension_b: this.myStallDimensionB,
      height_restrictions: this.myStallHeightRestriction
    })

    // exhibitor manners
    if(this.EXHIBITOR_BADGES.value.manners.length && this.user.exhibitor_mannings.length){
      this.EXHIBITOR_BADGES.get('manners').removeAt(0)
      this.user.exhibitor_mannings.forEach( (item) => {
        this.addBadge(
          item.name,
          item.designation,
          item.email,
          item.mobile,
          item.blood_group
        )
      })
    }
    console.warn('MANNERS', this.user.exhibitor_mannings)

    // patch value to POWER_REQUIREMENT Formgroup from user
    this.POWER_REQUIREMENT.patchValue({
      company_name: this.user.company_name,
      mobile_no: this.user.mobile_no,
      company_repName: this.user.company_repName,
      single_phase_connection: this.user?.single_phase_connection,
      three_phase_connection: this.user?.three_phase_connection
    })



    

    // patch company_name to EXHIBITOR_DELIVERABLES Formgroup from user
    this.EXHIBITOR_DELIVERABLES.patchValue({
      company_name: this.user.company_name,
      stall_number: this.myStall,
      // booth_number: this.myStall,
      stall_type: this.myStallType,
      stall_size: this.myStallArea,
      // height_restrictions: this.myStallHeightRestriction,
      food_coupons : this.myStallFoodCoupons + this.myStallExtraFoodCoupons  
    })

    // patch values to PARTICIPATION_FORM Formgroup from user
    this.PARTICIPATION_FORM.patchValue({
      company_name: this.user.company_name,
      stall_no: this.myStall,
    })

    
 


    this.BARE_SPACE_AND_STALL_DESIGN_APPROVAL.patchValue({
      // company_name: this.user.company_name,
      stall_number: this.myStall,
      stall_type: this.myStallType,
      stall_size: this.myStallArea,
      width : this.myStallDimensionA,
      height : this.myStallHeightRestriction,
      length:this.myStallDimensionB ,
      stall_design_correct: this.user.stall_design_correct
    })

    this.BOOTH_CONTRACTOR_AUTHORISATION_1.patchValue({
      company_name: this.user.company_name, 
      stall_number: this.myStall,
      stall_type: this.myStallType,
      stall_size: this.myStallArea,
      booth_contractor_applicable: this.user.booth_contractor_applicable
    })
    
  }



  // this.catalogueFormSubmitted = true  
    catalogueFormSubmitted:boolean = false;


  init_CATALOGUE_ENTRY_FORM(){
    let formSubmited = this.user.oem_catalog_entry ? true : false;
    this.CATALOGUE_ENTRY = new FormGroup({
      name_of_organisation: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      booth_no: new FormControl({ value: '', disabled: true }, [Validators.required]),
      address_line1: new FormControl({ value: '', disabled: formSubmited },[Validators.required]),
      address_line2: new FormControl({ value: '', disabled: formSubmited }),
      address_line3: new FormControl({ value: '', disabled: formSubmited }),
      city: new FormControl({ value: '', disabled: formSubmited },[Validators.required]),
      post_code: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      country: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      contact_person: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      catalogue_mobile_no: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      catalogue_email: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      website: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      contact_person_designation: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      company_profile: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      // company_logo: new FormControl({ value: '', disabled: formSubmited }, [Validators.required]),
      oem_catalog_entry: new FormControl({ value: true, disabled: formSubmited }, [Validators.required]),
    });

    
    this.init_CATALOGUE_ENTRY_PRINCIPLE_FORM();
    
  }

  CATALOGUE_ENTRY_PRINCIPLE:FormGroup;

  principle(){
    return new FormGroup({
      name: new FormControl({ value: '', disabled: false }, [Validators.required]),
      company: new FormControl({ value: '', disabled: false }, [Validators.required]),
      website: new FormControl({ value: '', disabled: false }, [Validators.required]),
    })
  }

  init_CATALOGUE_ENTRY_PRINCIPLE_FORM(){
    this.CATALOGUE_ENTRY_PRINCIPLE = new FormGroup({
      principles: new FormArray([this.principle()])
    })
    this.getPrinciple();
  }

  addPrinciple(){
    console.log('rehjvbfjkhbkjhkb');
    (<FormArray>this.CATALOGUE_ENTRY_PRINCIPLE.get('principles')).push(this.principle());
  }

  getPrinciples(){
    return (<FormArray>this.CATALOGUE_ENTRY_PRINCIPLE.get('principles')).controls;
  }

  removePrinciple(i:number){
    (<FormArray>this.CATALOGUE_ENTRY_PRINCIPLE.get('principles')).removeAt(i);
  }

  init_HOST_and_HOSTESS_FORM(){
    this.HOST_and_HOSTESS = new FormGroup({
      oem_host_hostess: new FormControl({ value: true, disabled: false }),
    });
  }

  async submitHOST_and_HOSTESS_FORM(){
    if(this.user?.oem_host_hostess){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')

    if(this.HOST_and_HOSTESS.invalid){
      return
    }
    if(this.hostTotal < 1){
      this._sb.info('Please Select at least one Host');
    }
    this.submited = true;
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', {
      host: JSON.stringify(this.hostSetting),
      oem_host_hostess: true
    })).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this.getUpdatedUserProfile();
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }



  userFormSubmitted : boolean = false
  init_USER_PROFILE_FORM(){
    let formSubmitted:boolean = this.user.oem_user_profile ? true : false;
    this.USER_PROFILE = new FormGroup({
      title: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      first_name: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      last_name: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      company_repName: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      email: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      alternative_email: new FormControl({ value: '', disabled: formSubmitted }),
      booth_number: new FormControl({ value: '', disabled: true },),
      booth_type: new FormControl({ value: '', disabled: true }),
      booth_size: new FormControl({ value: '', disabled: true },),
      dimension_a: new FormControl({ value: '', disabled: true }),
      dimension_b: new FormControl({ value: '', disabled: true }),
      height_restrictions: new FormControl({ value: '', disabled: true }),
      company_name: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      address_line1: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      address_line2: new FormControl({ value: '', disabled: formSubmitted }),
      address_line3: new FormControl({ value: '', disabled: formSubmitted }),
      city: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      post_code: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      country: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      state: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      mobile_no: new FormControl({ value: '', disabled: formSubmitted }, [Validators.required]),
      gst: new FormControl({ value: this.user?.gst, disabled: formSubmitted }, Validators.compose([
        Validators.required,
        this.patternValidator(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/, { gstInValid : true  }), Validators.maxLength(15)
      ])),
      website: new FormControl({ value: '', disabled: formSubmitted }, Validators.compose([
        Validators.required,
        this.patternValidator(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi, { websiteInValid : true  })
      ])),
      oem_user_profile: new FormControl({ value: true, disabled: formSubmitted }, [Validators.required]),
    });

    

  }
  

  newBadge(
    name = '',
    designation = '',
    email = '',
    mobile = '',
    blood_group = ''
  ){
    return new FormGroup({
      name: new FormControl({ value: name, disabled: false }, [Validators.required]),
      designation: new FormControl({ value: designation, disabled: false }, [Validators.required]),
      email: new FormControl({ value: email, disabled: false }, [Validators.required, Validators.email]),
      mobile: new FormControl({ value: mobile, disabled: false }, [Validators.required]),
      blood_group: new FormControl({ value: blood_group, disabled: false }, [Validators.required]),
    });
  }
  
  init_EXHIBITOR_BADGES_FORM(){
    // this.EXHIBITOR_BADGES = new FormGroup({
    //   name: new FormControl({ value: '', disabled: false }, [Validators.required]),
    //   designation: new FormControl({ value: '', disabled: false }, [Validators.required]),
    //   email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
    //   mobile: new FormControl({ value: '', disabled: false }, [Validators.required]),
    //   blood_group: new FormControl({ value: '', disabled: false }, [Validators.required]),
    // });
    this.EXHIBITOR_BADGES = new FormGroup({
      manners: new FormArray([
        new FormGroup({
          name: new FormControl({ value: '', disabled: false }, [Validators.required]),
          designation: new FormControl({ value: '', disabled: false }, [Validators.required]),
          email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
          mobile: new FormControl({ value: '', disabled: false },[Validators.required]),
          blood_group: new FormControl({ value: '', disabled: false }, [Validators.required]),
        })
      ])
    })
    console.log(this.getBadges())
  }
   isNumberKey(evt)
    {
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if(evt.target.value.length < 10){
            if (charCode > 31 && (charCode < 48 || charCode > 57)){
              event?.preventDefault();
              return false;
            }
            return true;
        }
        return false;
    }
 
  getBadges(): FormArray {
    return this.EXHIBITOR_BADGES.get('manners') as FormArray;
  }

  getFilledBadges(){
    // console.log('Manner', this.EXHIBITOR_BADGES.get('manners').value)
    return this.EXHIBITOR_BADGES.get('manners').value.filter( d => d.name != '' )
  }

  addBadge(
    name = '',
    designation = '',
    email = '',
    mobile = '',
    blood_group = ''
  ){
    if( this.getBadges()?.length >= (this.myStallBadges + this.myStallExtraBadges)){
      this._sb.error('You can not add more than '+(this.myStallBadges + this.myStallExtraBadges)+' badges')
      return
    }
    this.EXHIBITOR_BADGES.get('manners').push(this.newBadge(
      name,
      designation,
      email,
      mobile,
      blood_group
    ));
  }

  removeBadge(index){
    this.EXHIBITOR_BADGES.get('manners').removeAt(index);
  }



  async submitEXHIBITOR_BADGES_FORM(){
      if(this.user?.oem_exhibitor_badges){
        console.log('already submitted')
        this.stepper.next()
        return
      }
      
    // console.log(this.EXHIBITOR_BADGES.value);return;
    if(this.EXHIBITOR_BADGES.invalid){
      return
    }
    this.submited = true
    this.loading = true;
    this._sb.loading('Updating Badges')
    ;(await this._http.post('/exhibitor/addManners', this.EXHIBITOR_BADGES.value)).subscribe( (res:any) => {
      this.loading = false;
      this._sb.close()
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        this._sb.success(res.message)
        // this.getUpdatedUserProfile();
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.error(res.message)
      }
    })
  }

  async raiseRequestToChangeBadges(){
    this.submited = true
    this.loading = true;
    this._sb.loading('Raising Request...')
    ;(await this._http.post('/exhibitor/raiseRequestToChangeBadges', {})).subscribe( (res:any) => {
      this.loading = false;
      this._sb.close()
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        this._sb.success(res.message)
        // this.getUpdatedUserProfile();
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.error(res.message)
      }
    })
  }

  init_POWER_REQUIREMENT_FORM(){
    let formSubmited: boolean = this.user.oem_power_requirement ? true : false
    this.POWER_REQUIREMENT = new FormGroup({
      company_name: new FormControl({ value: this.user?.company_name, disabled: formSubmited }, [Validators.required]),
      company_repName: new FormControl({ value: this.user?.company_repName, disabled: formSubmited }, [Validators.required]),
      mobile_no: new FormControl({ value: this.user?.mobile_no, disabled: formSubmited }, [Validators.required]),
      single_phase_connection: new FormControl({ value: this.user?.single_phase_connection, disabled: formSubmited }),
      three_phase_connection: new FormControl({ value: this.user?.three_phase_connection, disabled: formSubmited }),
      oem_power_requirement: new FormControl({ value: true, disabled: formSubmited }, [Validators.required]),
    });
  }

  threePhaseCustomConn(e){
    let load = e.target.value
    // check if load is number
    if(isNaN(load)){
      
      this._sb.openSnackBar('Please select a valid load', 'OK', 3000)
      return
    }
    // add custom load
    this.POWER_REQUIREMENT.patchValue({
      three_phase_connection: load
    })
  }
  async submitPOWER_REQUIREMENT(){
    if(this.user?.oem_power_requirement){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')

    console.log(this.POWER_REQUIREMENT.value);
    console.log('====================================');
    // console.log(this.POWER_REQUIREMENT.value);return;
    if(this.POWER_REQUIREMENT.invalid){
      return
    }

    if(isNaN(this.POWER_REQUIREMENT.value.three_phase_connection)){
      this._sb.openSnackBar('Please select a valid load', 'OK', 3000)
      return
    }
    if(!(this.POWER_REQUIREMENT.value.single_phase_connection || this.POWER_REQUIREMENT.value.three_phase_connection)){
      this._sb.openSnackBar('Please select  power connection','OK',3000)
      return
    }
    if(this.POWER_REQUIREMENT.value.three_phase_connection == '' || isNaN(this.POWER_REQUIREMENT.value.three_phase_connection)){
      this.POWER_REQUIREMENT.patchValue({
        three_phase_connection: 0
      })
    }
    console.log('====================================');
    console.log(this.POWER_REQUIREMENT.value);
    console.log('====================================');
  
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', this.POWER_REQUIREMENT.value)).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this._http.getMyProfile();
        this.getUser();
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }
  removeSelection(){
    this.POWER_REQUIREMENT.patchValue({
      single_phase_connection: 0 ,
      three_phase_connection : 0 
    })
  }

  init_INDEMNITY_UNDERTAKING_FORM(){
    this.INDEMNITY_UNDERTAKING = new FormGroup({
      indemnity_undertaking: new FormControl({ value: this.user?.indemnity_undertaking, disabled: false }, [Validators.required]),
      oem_indemnity_undertaking: new FormControl({ value: true, disabled: false }, [Validators.required]),
    });
  }

  async submitINDEMNITY_UNDERTAKING(){
    if(this.user?.oem_indemnity_undertaking){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')
    if(this.INDEMNITY_UNDERTAKING.invalid){
      return
    }
    if(this.INDEMNITY_UNDERTAKING.value.indemnity_undertaking == false){
      Swal.fire({
        icon: 'warning',
        title: 'Please Accept Indemnity Undertaking'
      })
      return
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', this.INDEMNITY_UNDERTAKING.value)).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this._http.getMyProfile();
        this.getUser();
        // this.companyForm.reset()
        this.stepper.next()

      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  healthFomSubmitted : boolean = false

  init_HEALTH_UNDERTAKING_FORM(){
    let formSubmited = this.user.oem_health_undertaking ? true : false
    this.HEALTH_UNDERTAKING = new FormGroup({
      fever: new FormControl({ value: this.user?.fever, disabled: formSubmited }),
      cough: new FormControl({ value: this.user?.cough, disabled: formSubmited }),
      breathlessness: new FormControl({ value: this.user?.breathlessness, disabled: formSubmited }),
      sore_throat_running_nose: new FormControl({ value: this.user?.sore_throat_running_nose, disabled: formSubmited }),
      body_ache: new FormControl({ value: this.user?.body_ache, disabled: formSubmited }),
      other_symptom: new FormControl({ value: this.user?.other_symptom, disabled: formSubmited }),
      health_undertaking_accepted: new FormControl({ value: this.user?.health_undertaking_accepted, disabled: formSubmited }),
      oem_health_undertaking: new FormControl({ value: true, disabled: formSubmited }),
      option_a: new FormControl({ value: this.user?.option_a, disabled: formSubmited }),
      option_b: new FormControl({ value: this.user?.option_b, disabled: formSubmited }),
    });
  }




  // async submitVISA_INVITATION_LETTER(){
  //   if(this.isVisaApplicable){
  //     this.stepper.next()
  //     return
  //   }
  //   this.visaFormSubmitted = true
  //   if(this.VISA_INVITATION_LETTER.invalid){
  //     return
  //   }






  async submitHEALTH_UNDERTAKING_FORM(){
    if(this.user?.oem_health_undertaking){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')
    if(this.isHealthApplicable){
      this.stepper.next()
      return
    }
    this.healthFomSubmitted = true
    if(this.HEALTH_UNDERTAKING.value.health_undertaking_accepted == false){
      Swal.fire({
        icon: 'warning',
        title: 'Please Accept Health Undertaking'
      })
      return
    }
    console.log(this.HEALTH_UNDERTAKING.value)
    if(this.HEALTH_UNDERTAKING.invalid){
      return
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', this.HEALTH_UNDERTAKING.value)).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this._http.getMyProfile();
        this.getUser();
        // this.companyForm.reset()
        
        this.stepper.next()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  checkcontent(e){
    this.HEALTH_UNDERTAKING.patchValue({
      other_symptom: e.target.textContent
    })
  }

  passports:any = [];
  visaFormSubmitted:boolean = false;
  init_VISA_INVITATION_LETTER_FORM(){
    this.getPassports();
    this.VISA_INVITATION_LETTER = new FormGroup({
      prefix: new FormControl('Mr', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      middle_name: new FormControl(''),
      last_name: new FormControl('',[Validators.required]),
      company: new FormControl('', [Validators.required]),
      nationality: new FormControl('', [Validators.required]),
      dob: new FormControl('',[Validators.required]),
      address: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required]),
      pin_code: new FormControl('',[Validators.required]),
      country: new FormControl('',[Validators.required]),
      gender: new FormControl('',[Validators.required]),
      passport_number: new FormControl('',[Validators.required]),
      place_of_issue_of_passport_number: new FormControl('',[Validators.required]),
      date_of_issue_of_passport: new FormControl('',[Validators.required]),
      date_of_expiry_of_passport: new FormControl('',[Validators.required]),
      embassy_address_email: new FormControl(''),
      job_title: new FormControl('', [Validators.required]),
      email: new FormControl('',[Validators.required]),
      code: new FormControl('',[Validators.required]),
      mobile: new FormControl('',[Validators.required]),
      passport_image: new FormControl('',[Validators.required]),
    });
  }

  PassportSelect(event){
    this.passport_image = event.target.files[0]
    this.VISA_INVITATION_LETTER.patchValue({
      passport_image: this.passport_image.name
    })
  }

  

  async submitVISA_INVITATION_LETTER(){
    if(this.user.oem_visa){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    if(this.isVisaApplicable){

      (await this._http.put('/exhibitor/update/profile', 
        {
          visa_applicable: false,
          oem_visa: true
        }
      )).subscribe( (res:any) => {
        this.loading = false;
        console.log(res)
        if(res.status){
          // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
          Swal.fire({
            icon: 'success',
            title: 'Succesfully Submitted',
            text: 'Information Updated!'
          })
          this.getUpdatedUserProfile();
          // this.companyForm.reset()
          this.stepper.next()
        }else{
          this._sb.openSnackBar(res.message, 'OK', 3000)
        }
      })
      
      return
    }
    this.visaFormSubmitted = true
    if(this.VISA_INVITATION_LETTER.invalid){
      console.log(this.VISA_INVITATION_LETTER.value)
      return
    }

    if(!this.passport_image){
      Swal.fire({
        icon: 'warning',
        title: 'Please Upload Passport Image'
      })
      return
    }
    // convert formcontrol to formdata
    const formData = new FormData();
    formData.append('prefix', this.VISA_INVITATION_LETTER.value.prefix);
    formData.append('first_name', this.VISA_INVITATION_LETTER.value.first_name);
    formData.append('middle_name', this.VISA_INVITATION_LETTER.value.middle_name);
    formData.append('last_name', this.VISA_INVITATION_LETTER.value.last_name);
    formData.append('company', this.VISA_INVITATION_LETTER.value.company);
    formData.append('nationality', this.VISA_INVITATION_LETTER.value.nationality);
    formData.append('dob', this.VISA_INVITATION_LETTER.value.dob)
    formData.append('address', this.VISA_INVITATION_LETTER.value.address)
    formData.append('city', this.VISA_INVITATION_LETTER.value.city)
    formData.append('pin_code', this.VISA_INVITATION_LETTER.value.pin_code)
    formData.append('country', this.VISA_INVITATION_LETTER.value.country)
    formData.append('gender', this.VISA_INVITATION_LETTER.value.gender)
    formData.append('passport_number', this.VISA_INVITATION_LETTER.value.passport_number)
    formData.append('place_of_issue_of_passport_number', this.VISA_INVITATION_LETTER.value.place_of_issue_of_passport_number)
    formData.append('date_of_issue_of_passport', this.VISA_INVITATION_LETTER.value.date_of_issue_of_passport)
    formData.append('date_of_expiry_of_passport', this.VISA_INVITATION_LETTER.value.date_of_expiry_of_passport)
    formData.append('embassy_address_email', this.VISA_INVITATION_LETTER.value.embassy_address_email)
    formData.append('job_title', this.VISA_INVITATION_LETTER.value.job_title)
    formData.append('mobile', this.VISA_INVITATION_LETTER.value.code + this.VISA_INVITATION_LETTER.value.mobile)
    formData.append('file', this.passport_image, this.passport_image.name)



    this.submited = true
    this.loading = true;
    this._sb.loading('Uploading Passport');
    (await this._http.put('/exhibitor/update/profile', 
        {
          visa_applicable: true,
          oem_visa: true
        }
      )).subscribe()
    ;(await this._http.post('/exhibitor/uploadPassport', formData)).subscribe( (res:any) => {
      this.loading = false;
      this._sb.close();
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        this.visaFormSubmitted = false
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this.getPassports();
                
        // confirmation dialog Swal
        Swal.fire({
          title: 'Passport submitted!',
          text: "Do you want to add more?",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I want to add more!',
          cancelButtonText: 'No!'
        }).then((result) => {
          if (result.value) {
            // reset visa form
            this.VISA_INVITATION_LETTER.reset();
          }else{
            this.VISA_INVITATION_LETTER.reset();
            this.submited = false;
            this.stepper.next()
          }
        })
      }else{
        this._sb.error(res.message);
      }
    })
    
  }

  async getPassports(){
    await (await this._http.get('/exhibitor/getPassport')).subscribe( (res:any) => {
      this.passports = res.data
    })
    
  }

  openPassport(passport){
    // create a html popup window to show pdf
    const win = window.open(passport.passport_image, '_blank');
    win?.focus();
  }

  init_EXHIBITOR_DELIVERABLES_FORM(){
    let formSubmitted = this.user.exhibitor_deliverables_correct ? true : false;
    this.EXHIBITOR_DELIVERABLES = new FormGroup({
      company_name: new FormControl({ value: this.user?.company_name, disabled: formSubmitted }, [Validators.required]),
      stall_number: new FormControl({ value: '', disabled: true }),
      stall_type: new FormControl({ value: '', disabled: true }),
      stall_size: new FormControl({ value: '', disabled: true }),
      food_coupons: new FormControl({ value: '', disabled: true }),
      exhibitor_deliverables_correct: new FormControl({ value: this.user?.exhibitor_deliverables_correct, disabled: formSubmitted }),

    });
  }

  async submitEXHIBITOR_DELIVERABLES_FORM(){
    if(this.user?.exhibitor_deliverables_correct){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')
    
    if(!this.EXHIBITOR_DELIVERABLES.value.exhibitor_deliverables_correct){
      Swal.fire({
        title: 'Please check all detail correct checkbox?',
        icon: 'warning'
      })
      return
    }

    if(this.EXHIBITOR_DELIVERABLES.invalid){
      return
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', {
      company_name: this.EXHIBITOR_DELIVERABLES.value.company_name,
      exhibitor_deliverables_correct: this.EXHIBITOR_DELIVERABLES.value.exhibitor_deliverables_correct
      })).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this.getUpdatedUserProfile();
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  boothFormSubmitted:boolean = false;
  init_BOOTH_CONTRACTOR_AUTHORISATION_FORM(){
 
    this.BOOTH_CONTRACTOR_AUTHORISATION = new FormGroup({
      company_name: new FormControl('test',[Validators.required]),
      stall_number: new FormControl('A11',[Validators.required]),
      stall_type: new FormControl('nagpur'),
      stall_size: new FormControl('erer',[Validators.required]),
      food_coupons: new FormControl('nrgdf',[Validators.required]),
      contractor_company_name: new FormControl('proco'),
      contractor_contract_person_name: new FormControl('ninad'),
      contractor_contract_person_mobile: new FormControl('86549324566'),
      contractor_contract_person_email: new FormControl('ninad@gmail.com'),
      authorisation_letter: new FormControl('',[Validators.required])
    });
  }

  authorisation_letter:any;
  
  contractors:any = [];
  ContractorSelect(event){
    // console.log(this.file);
    this.authorisation_letter = event.target.files[0]
    this.BOOTH_CONTRACTOR_AUTHORISATION_1.patchValue({
      authorisation_letter: event.target.files[0].name
      
      
    })
  }
  init_BOOTH_CONTRACTOR_AUTHORISATION_1_FORM(){
    this.getContractors();
    this.BOOTH_CONTRACTOR_AUTHORISATION_1 = new FormGroup({
      company_name: new FormControl({value: this.user?.company_name, disabled: true},[Validators.required]),
      stall_number: new FormControl({value: this.myStall, disabled: true},[Validators.required]),
      stall_type: new FormControl({value: this.myStallType, disabled: true},[Validators.required]),
      stall_size: new FormControl({value: this.myStallArea, disabled: true},[Validators.required]),
      contractor_company_name: new FormControl('',[Validators.required]),
      contractor_person_name: new FormControl('',[Validators.required]),
      contractor_person_mobile: new FormControl('',[Validators.required]),
      contractor_person_email: new FormControl('',[Validators.required]),
      authorisation_letter: new FormControl('',[Validators.required]),
      booth_contractor_applicable: new FormControl(false,[Validators.required])
      // signature_and_stamp: new FormControl('',[Validators.required]),
    });
  }




  

  async submitBOOTH_CONTRACTOR_AUTHORISATION_1(){
    // if(this.user?.oem_booth_contractor){
    //   console.log('already submitted')
    //   this.stepper.next()
    //   return
    // }
    // console.log('not submitted')
    if(this.isBootApplicable){
      (await this._http.put('/exhibitor/update/profile', {
        booth_contractor_applicable: this.isBootApplicable,
        oem_booth_contractor : true
      })).subscribe( (res:any) => {
        this.loading = false;
        console.log(res)
        if(res.status){
          // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
          Swal.fire({
            icon: 'success',
            title: 'Succesfully Submitted',
            text: 'Information Updated!'
          })
          this.getUpdatedUserProfile();
          // this.companyForm.reset()
          this.stepper.next()
        }else{
          this._sb.openSnackBar(res.message, 'OK', 3000)
        }
      })
      return
    }
    this.boothFormSubmitted = true
    if(this.BOOTH_CONTRACTOR_AUTHORISATION_1.invalid){
      console.log(this.BOOTH_CONTRACTOR_AUTHORISATION_1.value)
      return
    }

    if(!this.authorisation_letter){
      Swal.fire({
        icon: 'warning',
        title: 'Please Upload Contractor Authorisation Letter',
      })
      return
    }
    // convert formcontrol to formdata
    const formData = new FormData();
    formData.append('contractor_company_name', this.BOOTH_CONTRACTOR_AUTHORISATION_1.value.contractor_company_name);
    formData.append('contractor_person_name', this.BOOTH_CONTRACTOR_AUTHORISATION_1.value.contractor_person_name);
    formData.append('contractor_person_mobile', this.BOOTH_CONTRACTOR_AUTHORISATION_1.value.contractor_person_mobile);
    formData.append('contractor_person_email', this.BOOTH_CONTRACTOR_AUTHORISATION_1.value.contractor_person_email);
    formData.append('file', this.authorisation_letter, this.authorisation_letter.name)



    this.submited = true
    this.loading = true;
    this._sb.loading('Uploading Contractor Authorisation Letter');
    (await this._http.put('/exhibitor/update/profile', {
      booth_contractor_applicable: true
    })).subscribe()
    ;(await this._http.post('/exhibitor/uploadContractor', formData)).subscribe( (res:any) => {
      this.loading = false;
      this._sb.close();
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        this.boothFormSubmitted = false;
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this.getContractors();
                
        // confirmation dialog Swal
        Swal.fire({
          title: 'Contractor Authorisation letter submitted!',
          text: "Do you want to add more?",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I want to add more!',
          cancelButtonText: 'No!'
        }).then((result) => {
          if (result.value) {
            this.BOOTH_CONTRACTOR_AUTHORISATION_1.patchValue({
              contractor_company_name: '',
              contractor_person_name: '',
              contractor_person_mobile: '',
              contractor_person_email: '',
              authorisation_letter: '',
            });
          }else{
            this.BOOTH_CONTRACTOR_AUTHORISATION_1.patchValue({
                contractor_company_name: '',
                contractor_person_name: '',
                contractor_person_mobile: '',
                contractor_person_email: '',
                authorisation_letter: '',
            });
            this.submited = false;
            this.stepper.next()
          }
        })
      }else{
        this._sb.error(res.message);
      }
    })
    
  }

  async getContractors(){
    await (await this._http.get('/exhibitor/getContractor')).subscribe( (res:any) => {
      this.contractors = res.data
    })
  }

  openContractor(contractor){
    // create a html popup window to show pdf
    const win = window.open(contractor.authorisation_letter, '_blank');
    win?.focus();
  }

  init_PARTICIPATION_FORM(){
    this.PARTICIPATION_FORM = new FormGroup({
      company_name: new FormControl({value: '', disabled: false}, [Validators.required]),
      stall_number: new FormControl({value: this.user?.company_name, disabled: true}, [Validators.required]),
      stall_type: new FormControl({value: '', disabled: true}, [Validators.required]),
      stall_size: new FormControl({value: '', disabled: true}, [Validators.required]),
      stall_dimension: new FormControl({value: '', disabled: true}, [Validators.required]),
      food_coupons: new FormControl({value: '', disabled: true}, [Validators.required]),
      oem_participation: new FormControl({value: true, disabled: true}, [Validators.required]),
    })
  }

  async submitPARTICIPATION_FORM(){
    (await this._http.put('/exhibitor/update/profile', {
      oem_participation: true
    })).subscribe( (res:any) => {
      
    })
  }

  
  bareFormSubmitted:boolean = true

  init_BARE_SPACE_AND_STALL_DESIGN_APPROVAL_FORM(){
    let formSubmited = this.user.oem_bare_space_stall_design ? true : false
    this.BARE_SPACE_AND_STALL_DESIGN_APPROVAL = new FormGroup({
      company_name: new FormControl({value: this.user?.company_name, disabled: formSubmited}, [Validators.required]),
      stall_number: new FormControl({value: '', disabled: true}, [Validators.required]),
      stall_type: new FormControl({value: '', disabled: true}, [Validators.required]),
      stall_size: new FormControl({value: '', disabled: true}, [Validators.required]),
      length: new FormControl({value: '', disabled: true}, [Validators.required]),
      height: new FormControl({value: '', disabled: true}, [Validators.required]),
      width: new FormControl({value: '', disabled: true}, [Validators.required]),
      stall_design: new FormControl({value: this.user?.stall_design, disabled: formSubmited}, [Validators.required]),
      stall_design_correct: new FormControl({value: this.user?.stall_design_correct, disabled: formSubmited}, [Validators.required]),
      oem_bare_space_stall_design: new FormControl({value: true, disabled: formSubmited}, [Validators.required]),
    });
  }




  // async submitBOOTH_CONTRACTOR_AUTHORISATION_1(){
  //   if(this.isBootApplicable){
  //     this.stepper.next()
  //     return
  //   }
  //   this.boothFormSubmitted = true
  //   if(this.BOOTH_CONTRACTOR_AUTHORISATION_1.invalid){
  //     console.log(this.BOOTH_CONTRACTOR_AUTHORISATION_1.value)
  //     return
  //   }


  async submitBARE_SPACE_AND_STALL_DESIGN_APPROVAL(){
    if(this.user?.oem_bare_space_stall_design){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')
    this.bareFormSubmitted = true
    if(!this.BARE_SPACE_AND_STALL_DESIGN_APPROVAL.value.stall_design_correct){
      Swal.fire({
        title: 'Please check all detail correct checkbox?',
        icon: 'warning'
      })
      return
    }
    if(this.BARE_SPACE_AND_STALL_DESIGN_APPROVAL.invalid){
      console.log('invalid',this.BARE_SPACE_AND_STALL_DESIGN_APPROVAL.value);
      return
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', {
      stall_design_correct: this.BARE_SPACE_AND_STALL_DESIGN_APPROVAL.value.stall_design_correct,
      oem_bare_space_stall_design: true
    })).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Information Updated!'
        })
        this.getUpdatedUserProfile();
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  stallDesignFileChange(e){
    this.stallDesignFile = e.target.files[0];
  }

  // Upload Stall design with upload status
  uploadStallDesign(){
    if(!this.stallDesignFile){
      this._sb.openSnackBar('Please select file', 'OK')
      return;
    }
    let formData = new FormData();
    formData.set('file', this.stallDesignFile, this.stallDesignFile.name);
    this.uploadStart = true;
    // Post Formdata with progress status
    this._http.postWithStatus('/exhibitor/upload/stallDesign', formData).subscribe((event:any) => {
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
          this.uploadStart = false
          if (event.body.status) {
            this.BARE_SPACE_AND_STALL_DESIGN_APPROVAL.patchValue({
              stall_design: event.body.url
            })
            this._sb.openSnackBar(event.body.message, 'OK')
            this.getUpdatedUserProfile();   
          } else {
            this._sb.openSnackBar(event.body.message, 'OK')
          }

      }
    })
  }
  submited:boolean = false;
  loading:boolean = false;

  async submitCATALOGUE_ENTRY_FORM(){
    if(this.user?.oem_catalog_entry){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')
    if(this.isCatalogueApplicable){
      this.stepper.next()
      return
    }
    this.catalogueFormSubmitted = true
    console.log(this.CATALOGUE_ENTRY.getRawValue())
    if(this.CATALOGUE_ENTRY.invalid){
      console.log(this.CATALOGUE_ENTRY)
      return;
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', this.CATALOGUE_ENTRY.getRawValue())).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Added',
          text: 'Company profile updated!'
        })
        if(this.CATALOGUE_ENTRY_PRINCIPLE.value.principles.length){
          this.submitCATALOGUE_ENTRY_FORM_PRINCIPLE();
        }else{
          this.getUpdatedUserProfile();
          this.stepper.next()
        }
        // this.companyForm.reset()
        // this.stepper.next()
      }else{
        this._sb.error(res.message)
      }
    })
  }

  principles:any = [];

  async getPrinciple(){
    ;(await this._http.get('/exhibitor/getPrinciple')).subscribe( (res:any) => {
      if(res.status){
        this.principles = res.data;
        
        if(this.principles.length){
          // add principle according to principole length
          for(let i = 0; i < this.principles.length; i++){
            this.addPrinciple();
          } 


          // set priciples formarray value to formcontrol
          this.CATALOGUE_ENTRY_PRINCIPLE.patchValue({
            principles: this.principles.map( (principle:any) => {
              // if(principle.name)
              //   this.addPrinciple();
              return {
                name: principle.name,
                company: principle.company,
                website: principle.website
              }
            })
          })
        }
      }
    })
  }

  async submitCATALOGUE_ENTRY_FORM_PRINCIPLE(){
    console.log(this.CATALOGUE_ENTRY_PRINCIPLE.getRawValue())
    if(this.CATALOGUE_ENTRY_PRINCIPLE.invalid){
      return;
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.post('/exhibitor/addPrinciple', this.CATALOGUE_ENTRY_PRINCIPLE.getRawValue())).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Added',
          text: 'Company principle updated!'
        })
        
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.error(res.message)
      }
    })
  }





    // async submitVISA_INVITATION_LETTER(){
  //   if(this.isVisaApplicable){
  //     this.stepper.next()
  //     return
  //   }
  //   this.visaFormSubmitted = true
  //   if(this.VISA_INVITATION_LETTER.invalid){
  //     return
  //   }



  async submitUSER_PROFILE(){
    console.log(this.USER_PROFILE)
    if(this.user?.oem_user_profile){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')
    this.userFormSubmitted = true
    console.log(this.USER_PROFILE.getRawValue())
    if(this.USER_PROFILE.invalid){
      return;
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', this.USER_PROFILE.getRawValue())).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      if(res.status){
        this._sb.openSnackBar('Company profile updated!', 'OK', 3000)
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Succesfully Added',
        //   text: 'Company profile updated!'
        // })
        this._auth.refreshToken1();
        this.init_USER_PROFILE_FORM();
        this.getUpdatedUserProfile();
        // this.companyForm.reset()
        
        this.stepper.next()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }


  // if(this.user?.oem_user_profile){
  //   console.log('already submitted')
  //   this.stepper.next()
  //   return
  // }
  // console.log('not submitted')

  async submitFascia(){
    if(this.user?.oem_fascia){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    console.log('not submitted')
    console.log(this.fascia.nativeElement.value)
    if(this.fascia.nativeElement.value.length < 1){
      this._sb.openSnackBar("Please provide fascia board name","OK",3000)
      return;
    }
    this.submited = true
    this.loading = true;
    ;(await this._http.put('/exhibitor/update/profile', { fascia: this.fascia.nativeElement.value, oem_fascia: true })).subscribe( (res:any) => {
      this.loading = false;
      console.log(res)
      console.log(this.fascia.nativeElement.value)
      if(res.status){
        this.submited = false;
        // this._sb.openSnackBar('Succesfully Registered', 'OK', 3000)
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Company fascia updated!'
        })
        this.getUpdatedUserProfile();
        // this.companyForm.reset()
        this.stepper.next()
      }else{
        this._sb.openSnackBar(res.message, 'OK', 3000)
      }
    })
  }

  async companyLogo(e){
    console.log(e.target.files[0])
    this.file = e.target.files[0]
    
  }

  async companyLogoUpload(){
    let formData = new FormData();
    formData.set('file', this.file, this.file.name);
    this.uploadStart = true;
    this._http.postWithStatus('/exhibitor/uploadLogo', formData).subscribe((event:any) => {
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
                  
                  this.user.company_logo = event.body.url
                  this.CATALOGUE_ENTRY.patchValue({
                    company_logo: this.user.company_logo
                  })
                  localStorage.setItem('user', JSON.stringify(this.user));
                  this.getUser();
                  this._sb.openSnackBar(event.body.message, 'OK')
                  this.uploadStart = false;
                  this.file = null;
                } else {
                  this._sb.openSnackBar(event.body.message, 'OK')
                }

      }
    })
  }

  async getVendor(){
    (await this._http.get('/vendor/getAll')).subscribe((res:any) => {
      if(res.status){
        this.vendorList = res.data;
        this.vendorProduct = this.vendorList[0].product;
      }
    })
  }

  // get vendor product from vendorList 
  getVendorProduct(selectedVendor){
    selectedVendor = selectedVendor.target.value;
    this.vendorProduct = this.vendorList.find(vendor => vendor.id == selectedVendor).product
    this.selectedProduct = []
    this.subTotal = 0;
    this.gst = 0;
    this.total = 0;
  }

  // set selected status of product from checkbox
  checkProduct(product){
    product.checked = !product.checked;
    if(product.checked){
      this.selectedProduct.push(product)
    }else{
      // remove object from array with id
      this.selectedProduct = this.selectedProduct.filter(p => p.id != product.id)
    }
    this.getTotalPrice();
    console.log(this.selectedProduct);
    
  }


  setQuantity(event,product){
    console.log(event);
    
   let prod = this.selectedProduct.find(
      p => p.id == product.id
    )
    if(prod){
      this.selectedProduct.map(
        p => {
          if(p.id == product.id){
            p.quantity = parseInt(event.target.value) || 1 ;
          }
        }
      )
      this.getTotalPrice();
    }else{
      this._sb.info('please select!')
    }
  }

  // get total price from selected product
  getTotalPrice(){
    this.total = 0;
    this.selectedProduct.forEach(product => {
      let quantity = product.quantity || 1;
      
      this.total += product.price * quantity
    })
    this.subTotal = this.total;
    this.gst = this.subTotal * 0.18;
    this.total = this.subTotal + this.gst;
  }

  // place vendor order
  async placeOrder(){
    if(this.user?.oem_furniture_requirement){
      console.log('already submitted')
      this.stepper.next()
      return
    }
    if(this.selectedProduct.length < 1){
      this._sb.openSnackBar('Please select atleast one product', 'OK')
      return;
    }
    this.loading = true;
    ;(await this._http.post('/vendor/order/createExhibitorOrder', {
      vendor_id: this.selectedProduct[0].vendor_id,
      items: this.selectedProduct,
      total: this.total,
      subTotal: this.subTotal,
      gst: this.gst
    })).subscribe(async (res:any) => {
      this.loading = false;
      if(res.status){
        // this._sb.openSnackBar('Order Placed', 'OK')
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Placed',
          text: 'Order Placed!'
        })
        this.selectedProduct = [];
        await this._http.put('/exhibitor/update/profile', {
          furniture_applicable: this.isFurnitureApplicable
        })
        this.getVendor();
      }else{
        this._sb.openSnackBar(res.message, 'OK')
      }
    })
  }

  vaccineFile: File;

  // set vaccine file on change
  vaccineFileChange(e){
    this.vaccineFile = e.target.files[0]
  }
  // Upload Vaccine file
  async uploadVaccine(){
    if(!this.vaccineFile){
      this._sb.openSnackBar('Please select file', 'OK')
      return;
    }
    let formData = new FormData();
    formData.set('file', this.vaccineFile, this.vaccineFile.name);
    this.uploadStart = true;
    // Post Formdata with progress status
    this._http.postWithStatus('/exhibitor/upload/vaccineCertificate', formData).subscribe((event:any) => {
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
          this.uploadStart = false
          if (event.body.status) {
            this._sb.openSnackBar(event.body.message, 'OK')
            this.getUpdatedUserProfile();   
          } else {
            this._sb.openSnackBar(event.body.message, 'OK')
          }

      }
    })
  }

  async getUpdatedUserProfile(){
    (await this._http.getMyProfile()).subscribe( (res:any) => {
      if(res.status){
        localStorage.setItem('user', JSON.stringify(res.data));
        this.getUser();
      }
    })
  }
  oemProgress:number = 0;
  async getOemProgress(){
    (await this._http.get('/exhibitor/getOEMProgress')).subscribe((res:any) => {
      console.log(res)
      this.oemProgress = res.data.oem.progress
    })
  }
  hostSetting:any;
  hostSubTotal:any = 0;
  hostGst:any = 0;
  hostTotal:any = 0;
  async getHostSetting(){
    (await this._http.get('/setting/getHostSetting')).subscribe((res:any) => {
      console.log(res)
      this.hostSetting = JSON.parse(res.data.value)
      this.hostSetting = this.hostSetting.map(ht => {
        
        let userHost = JSON.parse(this.user.host);
        console.log(userHost);
        let exist = userHost.find(e => e.category === ht.category)
        console.log(exist)
        return {
          ...ht,
          quantity: exist.quantity || 0
        }
        
      })
      this.getHostTotalPrice();
    })
  }

  check_host_quantity(h:any){
    if(this.user.host){
      let exist = this.user.host.some(e => e.category === h.category)
      console.log(exist)
      if (exist) {
        return exist.quantity
      }
    }
    return 0;
  }

  getHostTotalPrice(){
    let total = 0;
    this.hostSetting.forEach(ht => {
      let quantity = ht.quantity || 0;
      total += ht.rate_per_day * quantity * 3
    })
    this.hostSubTotal = total;
    this.hostGst = this.hostSubTotal * 0.18;
    this.hostTotal = this.hostSubTotal + this.hostGst;
  }
  

  hostQuamtity(e, h){
    console.log(e.target.value, h)
    this.hostSetting.map( ht => {
      if(ht.category == h.category){
        ht.quantity = parseInt(e.target.value)
      }
    });
    this.getHostTotalPrice();
  }

  badge_loading:boolean = false;
  // request badges
  async request_badges(){
    this.badge_loading = true;
    ;await (await this._http.get('/exhibitor/requestBadges')).subscribe((res:any) => {
      if(res.status){
        this.badge_loading = false;
        this._sb.openSnackBar(res.message, 'OK')
      }else{
        this.badge_loading = false;
        this._sb.openSnackBar(res.message, 'OK')
      }
    }, err => {
      this.badge_loading = false;
      this._sb.openSnackBar('something went wrong', 'OK')
    })
  }



  // code for word counter

  // var app = angular.module('myApp', []);
  // app.controller('myCtrl', function($scope) {
  //   $scope.text;
  //   $scope.words = 0;
  //   $scope.wordCounter = function() {
  //       var wordCount = $scope.text ? $scope.text.split(/\s+/) : 0;
  //       $scope.words = wordCount ? wordCount.length : 0;
  //   };
  //   $scope.sentences = 0;
  //   $scope.sentenceCounter = function() {
  //     var sentenceCount = $scope.text ? $scope.text.split(/[.?!][ "\n]/) : 0;
  //     $scope.sentences = sentenceCount ? sentenceCount.length - 1 : 0;
  //   };
  //   $scope.paragraphs = 0;
  //   $scope.paragraphCounter = function() {
  //     var paragraphCount = $scope.text ? $scope.text.split(/\n/) : 0;
  //     $scope.paragraphs = paragraphCount ? paragraphCount.length : 0;
  //   };
  // });


}
