import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import { ExhibitorComponent } from './exhibitor/exhibitor.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { DelegateRegistrationComponent } from './delegate-registration/delegate-registration.component';
import { VisitorsRegistrationComponent } from './visitors-registration/visitors-registration.component';
import { ExhibitorRegistrationComponent } from './exhibitor-registration/exhibitor-registration.component';

import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { SponserRegistrationComponent } from './sponser-registration/sponser-registration.component';
import { CorporateRegistrationComponent } from './corporate-registration/corporate-registration.component';
import {NgxMatIntlTelInputModule} from 'ngx-mat-intl-tel-input';
import { ProfileComponent } from './exhibitor/profile/profile.component';
import {MatRadioModule} from '@angular/material/radio';
import { ProgressComponent } from './common/progress/progress.component';
import {MatChipsModule} from '@angular/material/chips';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { ExhibitorLoginComponent } from './exhibitor-login/exhibitor-login.component';
import { StallPreferenceComponent } from './exhibitor/stall-preference/stall-preference.component';
import { SearchPipe } from './pipe/search.pipe';
import { OtpComponent } from './exhibitor-register/otp/otp.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DelegatePreviewComponent } from './delegate-registration/delegate-preview/delegate-preview.component';
import { BecomeASponserComponent } from './exhibitor/become-a-sponser/become-a-sponser.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ExhibitorOemComponent } from './exhibitor/exhibitor-oem/exhibitor-oem.component';
import {MatStepperModule} from '@angular/material/stepper';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MyCurrencyPipe } from './pipe/my-currency.pipe';
import { HotToastModule } from '@ngneat/hot-toast';
import { OrderDetailComponent } from './exhibitor/order-detail/order-detail.component';
import { RegistrationExhibitorComponent } from './registration-exhibitor/registration-exhibitor.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { VisitorOtpComponent } from './visitors-registration/visitor-otp/visitor-otp.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ExhibitorRegisterationConfirmationComponent } from './exhibitor-register/exhibitor-registeration-confirmation/exhibitor-registeration-confirmation.component';

// import {MatListModule} from '@angular/material/list';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    // ExhibitorComponent,
    DelegateRegistrationComponent,
    VisitorsRegistrationComponent,
    ExhibitorRegistrationComponent,
    VendorRegistrationComponent,
    SponserRegistrationComponent,
    CorporateRegistrationComponent,
    // ProfileComponent,
    ProgressComponent,
    ExhibitorLoginComponent,
    // StallPreferenceComponent,
    SearchPipe,
    OtpComponent,
    DelegatePreviewComponent,
    // BecomeASponserComponent,
    // ExhibitorOemComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RegistrationExhibitorComponent,
    VisitorOtpComponent,
    TermsAndConditionComponent,
    ExhibitorRegisterationConfirmationComponent,
    // MyCurrencyPipe,
    // OrderDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatRadioModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatProgressBarModule,
    NgxMatIntlTelInputModule,
    MatChipsModule,
    MatFileUploadModule,
    MatTooltipModule,
    MatExpansionModule,
    ScrollingModule,
    MatPaginatorModule,
    MatStepperModule,
    NgxImageZoomModule,
    MatCheckboxModule,
    NgOtpInputModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      "class":'',
      "radius": 60,
      "space": -5,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
    }),
    HotToastModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
