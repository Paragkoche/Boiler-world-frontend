import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delegate-preview',
  templateUrl: './delegate-preview.component.html',
  styleUrls: ['./delegate-preview.component.scss']
})
export class DelegatePreviewComponent implements OnInit {
  status = 'loading...'
  loading:boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
    this.loading = true;
    setTimeout( () => {
      this.status = 'validating'
    }, 2000)

    setTimeout( () => {
      this.status = 'validated'
    }, 4000)

    setTimeout( () => {
      this.status = ''
      this.loading = false;
    }, 6000)
  }

}
