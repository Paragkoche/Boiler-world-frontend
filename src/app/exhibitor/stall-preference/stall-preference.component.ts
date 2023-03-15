import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { ProfileComponent } from '../profile/profile.component';
import Swal from 'sweetalert2'
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatSelect } from '@angular/material/select';
// import $ from "jquery";
declare var jQuery : any;
declare function svgPanZoom(a:any, b:any):any;
@Component({
  selector: 'app-stall-preference',
  templateUrl: './stall-preference.component.html',
  styleUrls: ['./stall-preference.component.scss']
})
export class StallPreferenceComponent implements OnInit {



  @ViewChild('cardContent') cardContent: ViewContainerRef;
  selectedValue: any;
  searchTxt: any;

  stalls: any;
  stalls1: any;
  stalls2: any;
  stalls3: any;

  preference:any = []
  preferenceForm: FormGroup;
  myGroup: FormGroup;
  submited: boolean;
  loading: boolean;
  user: any;
  constructor(
    private _http: HttpService,
    private _fb:FormBuilder,
    public _sb: SnackBarService,
    private elementRef:ElementRef
  ) {
    this.getPreference()
    // this.preferenceForm = this._fb.group({
    //   pref1: this._fb.array([])
    // });

    this.myGroup = new FormGroup({
      search: new FormGroup({ search: new FormControl() })
   });

    this.preferenceForm = this._fb.group({
      preferences: this._fb.array([])
    });
    
    this.addEmployee()
    this.addEmployeeSkill(0)
    this.addEmployee()
    this.addEmployeeSkill(1)
    this.setPref(this.preference)
   }

   searchText(e){
     this.searchTxt = e.target.value
   }

   getPreference(){
    const userJson = localStorage.getItem('user');
    this.user = userJson !== null ? JSON.parse(userJson) : {};
    this.preference = this.user.stall_pref
   }

  preferences(): FormArray {
    return this.preferenceForm.get('preferences') as FormArray;
  }
   
  newEmployee(): FormGroup {
    return this._fb.group({
      preference: this.preferences().length +1,
      stalls: this._fb.array([])
    });
  }
   
  addEmployee() {
    if(this.preferences().length < 3){
      this.preferences().push(this.newEmployee());
    }
  }

  removeEmployee(empIndex: number) {
    this.preferences().removeAt(empIndex);
  }

  employeeSkills(empIndex: number): FormArray {
    return this.preferences()
      .at(empIndex)
      .get('stalls') as FormArray;
  }

  addEmployeeSkill(empIndex: number) {
    // if( this.employeeSkills(empIndex).value.length < 3 )
      this.employeeSkills(empIndex).push(this.newSkill());
  }

  newSkill(): FormGroup {
    return this._fb.group({
      stall: ''
    });
  }

  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }
  ngOnInit(): void {
    this.getStalls();
  }

  // Get Total Area of Stall
  getTotalArea(empIndex: number) {
    // console.log(empIndex)
    let stalls =  this.preferences()
      .at(empIndex)
      .get('stalls') as any;

      // console.log(stalls);
      let totalArea: number = 0;
      if(stalls?.controls?.length && stalls.controls[0].value.stall){
        stalls.controls.forEach(stall => {
          // console.log(stall.value.stall)
          let stallNo = stall.value.stall
          let foundStall = this.stalls.find( (s) => s.stall_no == stallNo)
          if(foundStall)
            totalArea = totalArea + parseInt(foundStall.area)
        });
      }
        // console.log(totalArea)
      return totalArea
  }

  stallList : any = []

  async getStalls(){
    (await this._http.get('/stall')).subscribe( (res:any) => {
      if(res.status){
        console.log(res.data)
        this.stalls = res.data;
        this.stalls1 = Array.from(this.stalls);
        this.stalls2 = Array.from(this.stalls);
        this.stalls3 = Array.from(this.stalls);

        // making stall grey when it is booked

        this.stallList = res.data.filter((item:any) => item.exhibitor_id != null);
        console.log(this.stallList);
        let path:any;

          

        let object:any = document.getElementById('svg-object');
        console.log(object?.contentDocument?.getElementById('SA2'));
        
        object.addEventListener("load", (event:any) => { 
          console.log('loaded')

          svgPanZoom('#svg-object', {
            zoomEnabled: true,
            controlIconsEnabled: true
          });
          
          this.stallList.forEach((item:any) => {

            let $description = document.getElementById('description');
  
            path = object?.contentDocument?.getElementById('S'+item.stall_no);
            // console.log(path)
            // set style fill of path
            path?.setAttribute('fill','#F596C7');
            path?.setAttribute('data-stall',item.id)
            // add event listners for mousehover to path element
            path?.addEventListener('mouseover', function (e:any) {
              // add class active to path element
              path?.setAttribute('class', 'enabled heyo');
              $description?.classList.add('active');
              if($description){
                $description.innerHTML = item.stall_no+'('+ item.area +'m<sup>2</sup>)-'+item.exhibitor.company_name;
                $description.style.left = e.pageX + 20 + 'px';
                $description.style.top = e.pageY - 50 + 'px';
              }
            })
            path?.addEventListener('mouseout', function (e:any) {
              // remove class active from path element
              path?.setAttribute('class', 'enabled');
              $description?.classList.remove('active');
            })

          })
          
        });
      }
    })
    
  }


  

  async submit(){
    console.log(this.preferenceForm.value)
    if(this.preferenceForm.invalid){
      return;
    }
    
    this.submited = true
    this.loading = true;
    (await this._http.post('/stall/submitPreference', this.preferenceForm.value)).subscribe( (res:any) => {
      this.loading = false;
      console.log(res);
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Succesfully Submitted',
          text: 'Your preference has been successfully submitted!'
        }).then( () => window.location.reload())
        localStorage.setItem('user', JSON.stringify(res.data))
        this.getPreference()
      }else{
        Swal.fire({
          icon: 'error',
          title: res.message
        })
      }
      
    }, err => {
      this.loading = false
      this.submited = false
      this._sb.openSnackBar('Please try again after sometime', 'OK', 2000)
    })
  }

  preference_1:any;
  preference_2:any;
  preference_3:any;
  setPref(preference:any = []){
    this.preference_1 = preference.filter( (x)=>{ if(x.preference_no == 1 ){return x}})
    this.preference_2 = preference.filter( (x)=>{ if(x.preference_no == 2 ){return x}})
    this.preference_3 = preference.filter( (x)=>{ if(x.preference_no == 3 ){return x}})
    console.log(this.preference_1)
    console.log(this.preference_2)
    console.log(this.preference_3)
    return
  }

  getTotalArea2(pref){
    let totalArea:number = 0;
    pref.forEach(stall => {
      let foundStall = this.stalls.find( (s) => s.stall_no == stall.stall_no)
      if(foundStall)
        totalArea = totalArea + parseInt(foundStall.area)
    });
    return totalArea
  }

  employeeExactSkills(empIndex){
    let stalls =  this.preferences()
      .at(empIndex)
      .get('stalls') as any;
    return stalls.value.filter( s => s.stall != '')
  }

  selectedStall1:any = [];
  selectedStall2:any = [];
  selectedStall3:any = [];
  selectStall(e, empIndex:number){
    // let select = document.getElementsByClassName('select-1')
    
    // this.elementRef.nativeElement.querySelector('.select-1')
    //                             .addEventListener('click', console.log(this));

    empIndex = empIndex + 1
    console.log(empIndex, e.value)
    let stall_no = e.value
    if( empIndex == 1 ){
      console.log(this.employeeSkills(empIndex - 1).value)
      let stalls = this.employeeSkills(empIndex - 1).value

      this.stalls.forEach((item, index) => { 
        item["pref1selected"] = false
       })

      this.stalls.map(stall => {
        
        stalls.forEach(s => {
          let stall1 = s.stall
          console.log(stall, stall1)
          if( stall.stall_no == stall1 ){
            stall["pref1selected"] = true;
          }
        });
      });
      console.log(this.stalls)
    }
    if( empIndex == 2 ){

      let stalls = this.employeeSkills(empIndex - 1).value

      this.stalls.forEach((item, index) => { 
        item["pref2selected"] = false
       })

      this.stalls.map(stall => {
        
        stalls.forEach(s => {
          let stall1 = s.stall
          console.log(stall, stall1)
          if( stall.stall_no == stall1 ){
            stall["pref2selected"] = true;
          }
        });
      });

    }
    if( empIndex == 3 ){
      let stalls = this.employeeSkills(empIndex - 1).value

      this.stalls.forEach((item, index) => { 
        item["pref3selected"] = false
       })

      this.stalls.map(stall => {
        
        stalls.forEach(s => {
          let stall1 = s.stall
          console.log(stall, stall1)
          if( stall.stall_no == stall1 ){
            stall["pref3selected"] = true;
          }
        });
      });
    }
  }


  ngAfterViewInit(){
    console.log('NgAfterViewInit');
    (function ($)
    {
      $(document).ready(function(){
        console.log('I am born ready');
        $("#panzoom").panzoom({
          $zoomIn: $(".zoom-in"),
          $zoomOut: $(".zoom-out"),
          $zoomRange: $(".zoom-range"),
          $reset: $(".reset"),
          
          contain: 'invert',
        });
      })
    })(jQuery)
  }

}
