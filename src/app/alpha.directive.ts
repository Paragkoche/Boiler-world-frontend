import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[alphaOnly]'
})
export class AlphaOnlyDirective {
  // Regex for alphaOnly only
  private regex: RegExp = new RegExp(/^\d+$/g);
  // Allow key codes for special events Backspace, tab, end, home
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}