import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'aaf-modal',
  templateUrl: './aaf-modal.component.html',
  styleUrls: ['./aaf-modal.component.css']
})
export class AafModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AafModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('data', data);
  }

  ngOnInit() {}

}
