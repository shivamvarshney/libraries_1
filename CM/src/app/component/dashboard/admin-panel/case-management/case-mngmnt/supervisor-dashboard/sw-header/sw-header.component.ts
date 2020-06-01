import { Component, OnInit } from '@angular/core';
import { PermissionIds } from '@src/core/utills/masterPermission';

@Component({
  selector: 'sw-header',
  templateUrl: './sw-header.component.html',
  styleUrls: ['./sw-header.component.scss', '../../cm-module.scss']
})
export class SwHeaderComponent implements OnInit {

  pIds:any;
  constructor() { }

  ngOnInit() {
    this.pIds = PermissionIds;
  }

}
