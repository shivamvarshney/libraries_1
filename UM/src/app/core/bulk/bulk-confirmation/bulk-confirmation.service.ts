import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BulkCOnfirmationComponent } from './bulk-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class BulkConfirmationDialogService {

  static openDialog: any;

  constructor(public _dialog: MatDialog) { }

  openCommonModal(modalData) { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: modalData.title,      
      isUnsuccess:modalData.isUnsuccess,
      tosterMsg:modalData.tosterMsg,
      unsuccessUsersFile:modalData.unsuccessUsersFile,
      totalRecord:modalData.uploadedFile
    };
    const dialogRef = this._dialog.open(BulkCOnfirmationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
