import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DelegateRegistrationComponent } from './delegate-registration/delegate-registration.component';
import { VisitorsRegistrationComponent } from './visitors-registration/visitors-registration.component';
import { ExhibitorRegistrationComponent } from './exhibitor-registration/exhibitor-registration.component';
import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { SponserRegistrationComponent } from './sponser-registration/sponser-registration.component';
import { CorporateRegistrationComponent } from './corporate-registration/corporate-registration.component';
import { ExhibitorGuard } from './guards/exhibitor.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProductListComponent } from './vendor/product-list/product-list.component';
import { VendorGuard } from './guards/vendor.guard';
import { RegistrationExhibitorComponent } from './registration-exhibitor/registration-exhibitor.component';
import { OtpComponent } from './exhibitor-register/otp/otp.component';
import { ExhibitorRegisterationConfirmationComponent } from './exhibitor-register/exhibitor-registeration-confirmation/exhibitor-registeration-confirmation.component';


const routes: Routes = [{
  path: '',
  component: LoginComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'register',
  component: RegisterComponent
},
{
  path: 'visitors-register',
  component: VisitorsRegistrationComponent
},
{
  path: 'delegate-register',
  component: DelegateRegistrationComponent
},
{
  path: 'exhibitor-register',
  component: ExhibitorRegistrationComponent
},
{
  path: 'register-exhibitor',
  component: RegistrationExhibitorComponent
},
{
  path: 'vendor-register',
  component: VendorRegistrationComponent
},
{
  path: 'sponser-register',
  component: SponserRegistrationComponent
},
{
  path: 'corporate-register',
  component: CorporateRegistrationComponent
},
{
  path: 'forgetpassword',
  component: ForgotPasswordComponent
},
{
  path: 'resetpassword/:id/password-reset/:token',
  component: ResetPasswordComponent
},
{
  path: 'exhibitor-confirmation',
  component: ExhibitorRegisterationConfirmationComponent
},
{
  path : 'otp',
  component :  OtpComponent
},
// {
//   path: 'exhibitor',
//   component: ExhibitorComponent,
//   canActivate: [AuthGuard, ExhibitorGuard],
//   children: [
//     {
//       path: '',
//       component: ProfileComponent
//     },
//     {
//       path: 'profile',
//       component: ProfileComponent
//     },
//     {
//       path: 'stall-preference',
//       component: StallPreferenceComponent
//     },
//     {
//       path: 'become-a-sponser',
//       component: BecomeASponserComponent
//     },
//     {
//       path: 'oem',
//       component: ExhibitorOemComponent
//     }
//   ]
// },

{
  path: 'exhibitor',
  canActivate: [AuthGuard, ExhibitorGuard],
  loadChildren: () => import('./exhibitor/exhibitor.module').then(m => m.ExhibitorModule),
},

// {
//   path : 'vendor',
//   component : VendorComponent,
//   canActivate: [AuthGuard],
//   children:[
//     {
//       path : 'add-product',
//       component: AddProductComponent
//     },
//     {
//       path : 'product-list',
//       component : ProductListComponent
//     }
//   ]
// },
{
  path : 'productlist',
  component : ProductListComponent
},
{
  path: 'vendor',
  canActivate: [AuthGuard, VendorGuard],
  loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule),
},
{
  path: '**',
  component: LoginComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
