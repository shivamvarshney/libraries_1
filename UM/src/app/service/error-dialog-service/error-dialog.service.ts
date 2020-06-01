import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorDialogComponent } from '@src/shared/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  static openDialog: any;

  constructor( public _dialog: MatDialog ) { }

  openModal(modalData){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: modalData.title,
      reason: modalData.reason,
      status: modalData.status
    };
    const dialogRef = this._dialog.open(ErrorDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }
}
