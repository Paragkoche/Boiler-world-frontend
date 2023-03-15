import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HotToastService } from '@ngneat/hot-toast';
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor (private _snackBar: MatSnackBar, private _toast: HotToastService) { }

  openSnackBar (message: string, action: string, duration: number = 5000) {
    const options: any = {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    };
    if (duration) {
      options.duration = duration
    }
    this._snackBar.open(message, action, options);
  }

  openFromComponent(Component){
    this._snackBar.openFromComponent(Component)
  }

  openTemplateRef(template, config = {}){
    this._snackBar.openFromTemplate(template, config)
  }

  // Hot Toast service
  openToast(){
    this._toast.show('I am on top-right',
    {
      icon: '↗',
      position: 'top-right'
    }
    )
  }

  show(component){
    this._toast.show(component)
  }

  loading(message){
    this._toast.loading(message)
  }

  close(){
    this._toast.close()
  }

  error(message){
    this._toast.error(message)
  }

  warning(message){
    this._toast.warning(message)
  }

  success(message){
    this._toast.success(message,{
      dismissible: true,
    })
    
  }

  info(message){
    this._toast.info(message)
  }
}
