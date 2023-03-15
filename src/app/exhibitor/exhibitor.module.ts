import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExhibitorRoutingModule } from './exhibitor-routing.module';
import { ExhibitorComponent } from './exhibitor.component';
import { HttpClientModule } from '@angular/common/http';
import { HotToastModule } from '@ngneat/hot-toast';
import { ProfileComponent } from './profile/profile.component';
import { StallPreferenceComponent } from './stall-preference/stall-preference.component';
import { BecomeASponserComponent } from './become-a-sponser/become-a-sponser.component';
import { ExhibitorOemComponent } from './exhibitor-oem/exhibitor-oem.component';
import { MyCurrencyPipe } from '../pipe/my-currency.pipe';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { MatChipsModule } from '@angular/material/chips';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProgressComponent } from './common/progress/progress.component';
import {MatIconModule} from '@angular/material/icon'
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { ViewimageComponent } from './viewimage/viewimage.component';
import { EventsComponent } from './events/events.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [
    ExhibitorComponent,
    ProfileComponent,
    ProgressComponent,
    StallPreferenceComponent,
    BecomeASponserComponent,
    ExhibitorOemComponent,
    OrderDetailComponent,
    MyCurrencyPipe,
    ViewimageComponent,
    EventsComponent
  ],
  imports: [
    CommonModule,
    ExhibitorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatRadioModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatProgressBarModule,
    NgxMatIntlTelInputModule,
    MatChipsModule,
    MatFileUploadModule,
    MatTooltipModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatStepperModule,
    NgxImageZoomModule,
    MatDividerModule,

    MatDatepickerModule,
    MatCheckboxModule,
    HotToastModule.forRoot(),
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
  ]
})
export class ExhibitorModule { }
