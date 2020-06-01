import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations'
@Component({
  selector: 'sw-reports',
  templateUrl: './sw-reports.component.html',
  styleUrls: ['./sw-reports.component.scss', '../../cm-module.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1000 )
      ]),
      transition(':leave',
        animate(1000, style({opacity: 0})))
    ])
  ]
})
export class SwReportsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
