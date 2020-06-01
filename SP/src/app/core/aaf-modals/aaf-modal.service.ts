import { Injectable } from '@angular/core'; 
import { MatDialog,MatDialogConfig,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { AafModalComponent } from './aaf-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AafModelService {
  
  static openDialog: any;
  constructor(public dialog: MatDialog) {}
  openModal(modalData: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = modalData.modalWidth || '300px';
    if (modalData.modalHeight) {
      dialogConfig.height = modalData.modalHeight;
    }
    dialogConfig.data = {
      title: modalData.title,
      reason: modalData.reason,
      status: modalData.status,
      modelStatus: modalData.modelStatus,
      titleOtherPart: modalData.airTimeBalance || '',
      reasonOtherPart: modalData.remainingBalance || '',
      callBack: modalData.callBack,
      proceedText: modalData.proceed_caps || 'PROCEED',
      cancelText: modalData.cancel_caps || 'CANCEL'
    };
    const dialogRef = this.dialog.open(AafModalComponent, dialogConfig);
  }
}
