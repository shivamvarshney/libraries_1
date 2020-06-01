import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonDialogComponent } from 'src/app/shared/common-dialog/common-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonDialogService {

  static openDialog: any;

  constructor( public _dialog: MatDialog ) { }

  openCommonModal(modalData){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: modalData.title
    };
    const dialogRef = this._dialog.open(CommonDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
