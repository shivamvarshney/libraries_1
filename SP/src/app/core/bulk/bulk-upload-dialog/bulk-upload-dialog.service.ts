import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BulkUploadDialogComponent } from './bulk-upload-dialog.component';
 
@Injectable({
  providedIn: 'root'
})
export class BulkUploadDialogService {

  static openDialog: any;

  constructor( public _dialog: MatDialog ) { }

  openCommonModal(modalData){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      uplaodBulkInfo: modalData.uplaodBulkInfo     
    };    
    const dialogRef = this._dialog.open(BulkUploadDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
