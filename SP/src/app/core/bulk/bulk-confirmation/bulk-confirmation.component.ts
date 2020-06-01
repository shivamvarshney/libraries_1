import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FacadeService } from '@src/core/services/facade.service';
import { Router } from '@angular/router';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './bulk-confirmation.html',
  styleUrls: ['./bulk-confirmation.css']
})
export class BulkCOnfirmationComponent implements OnInit, OnDestroy {
  unsuccessUsersFileSubscribe: Subscription;
  checkFailedFileDownloadPermission: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BulkCOnfirmationComponent>,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private router: Router) { }
    
  ngOnInit() {
    if (this.data.confirmationObj && this.data.confirmationObj.permissionName && this.facadeService.validateSpecificPermission(this.data.confirmationObj.permissionName)) {
      this.checkFailedFileDownloadPermission = true;
    }
  }

  downloadUploadedCSV() {
    this.ngxService.start();
    let downloadObj = { 'opcoCode': apiUrls.opco };
    this.unsuccessUsersFileSubscribe = this.facadeService.downloadFile(this.data.confirmationRespObj.unsuccessUsersFile, downloadObj, 'csv').subscribe(
      (resp: any) => {
        this.ngxService.stop();
        let data = resp.body;
        if ((data.statusCode == 200) && data.result) {          
          AppUtills.makeCSV(resp.body.result, this.data.confirmationObj.fileName);
        } else {
          this.ngxService.stop();
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }
      },
      err => {
        this.ngxService.stop();
        if (AppUtills.showErrorMessage(err)) {
          this.facadeService.openArchivedSnackBar(err.statusText || 'Something Went Wrong', 'Retry');
        } else {
          this.modelPopupClose();
        }
      },
      () => {
        this.ngxService.stop();
      }
    )
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this.router.navigate([uri])
    );
  }

  // close popup model
  modelPopupClose() {
    //this.facadeService.openArchivedSnackBar(this.data.tosterMsg, 'Success');    
    this.dialogRef.close();
    this.redirectTo(this.router.url);
  }
  ngOnDestroy() {
    this.unsuccessUsersFileSubscribe ? this.unsuccessUsersFileSubscribe.unsubscribe() : '';
  }

}
