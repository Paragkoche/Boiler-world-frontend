import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(stalls: any[], searchTxt: string): any[] {
    console.log('hi')
    if(!stalls || !stalls.length) return stalls;
    if(!searchTxt || !searchTxt.length) return stalls;
    return stalls.filter(s => {
      return s.stall_no.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1
    });
  }

}
