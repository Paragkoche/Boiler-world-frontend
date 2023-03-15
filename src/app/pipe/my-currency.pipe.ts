import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCurrency'
})
export class MyCurrencyPipe implements PipeTransform {

  transform(
    value: number,
    currencyCode: string = 'INR',
    display:
        | 'code'
        | 'symbol'
        | 'symbol-narrow'
        | string
        | boolean = 'symbol',
    digitsInfo: string = '3.2-2',
    locale: string = 'en-IN',
): string | null {
  let curr = formatCurrency(
    value,
    locale,
    getCurrencySymbol(currencyCode, 'wide'),
    currencyCode,
    digitsInfo,
  )
  console.log(curr)
    return curr;
}

}
