import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ExhibitorGuard } from '../guards/exhibitor.guard';
import { BecomeASponserComponent } from './become-a-sponser/become-a-sponser.component';
import { EventsComponent } from './events/events.component';
import { ExhibitorOemComponent } from './exhibitor-oem/exhibitor-oem.component';
import { ExhibitorComponent } from './exhibitor.component';
import { ProfileComponent } from './profile/profile.component';
import { StallPreferenceComponent } from './stall-preference/stall-preference.component';

const routes: Routes = [
  {
  path: '',
  component: ExhibitorComponent,
  canActivate: [AuthGuard, ExhibitorGuard],
  children: [
    {
      path: '',
      component: ProfileComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: 'stall-preference',
      component: StallPreferenceComponent
    },
    {
      path: 'become-a-sponsor',
      component: BecomeASponserComponent
    },
    {
      path: 'oem',
      component: ExhibitorOemComponent
    },
    {
      path: 'events',
      component : EventsComponent
    }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExhibitorRoutingModule { }
