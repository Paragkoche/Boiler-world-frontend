import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})

export class ProgressComponent implements OnInit {
  @Input('color') color: ThemePalette = 'primary';
  @Input('mode') mode: ProgressBarMode = 'determinate';
  @Input('value') value = 0;
  @Input('bufferValue') bufferValue = 75;
  @Input('title') title:string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
