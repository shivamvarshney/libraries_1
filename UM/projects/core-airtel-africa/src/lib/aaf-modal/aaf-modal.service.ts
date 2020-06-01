import { Injectable } from '@angular/core'; 
import { MatDialog,MatDialogConfig,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { AafModalComponent } from './aaf-modal.component';
@Injectable({
  providedIn: 'root'
})
export class AafModalService {
  openDialog: any;
  constructor(public dialog: MatDialog) {}
  openModal(modalData: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    dialogConfig.data = {
      title: modalData.title,
      reason: modalData.reason,
      status: modalData.status
    };
    const dialogRef = this.dialog.open(AafModalComponent, dialogConfig);
  }
}
 