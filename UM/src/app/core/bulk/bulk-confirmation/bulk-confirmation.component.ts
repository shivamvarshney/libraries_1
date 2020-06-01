import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FacadeService } from '@src/core/services/facade.service';
import { Router } from '@angular/router';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { PermissionIds } from '@src/core/utills/masterPermission';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './bulk-confirmation.html',
  styleUrls: ['./bulk-confirmation.css']
})
export class BulkCOnfirmationComponent implements OnInit, OnDestroy {

  downloadUnsuccessFullFileSubscription: Subscription;
  checkFailedFileDownloadPermission: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BulkCOnfirmationComponent>,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private router: Router) { }

  ngOnInit() {
    if (this.facadeService.validateSpecificPermission(PermissionIds.DOWNLOAD_FAILED_USER_FILE)) {
      this.checkFailedFileDownloadPermission = true;
    }    
  }
  downloadUploadedCSV() {
    this.ngxService.start();
    let downloadObj = { 'opcoCode': apiUrls.opco };
    this.downloadUnsuccessFullFileSubscription = this.facadeService.onUserPostAPI(this.data.unsuccessUsersFile, downloadObj).subscribe(
      (resp: any) => {
        let data = resp;
        if (data.body && data.body.statusCode == 200) {
          let objectData = AppUtills.decode(data.body.result);
          const blob = new Blob([objectData], { type: 'text/csv' });
          var link = document.createElement('a');
          link.download = 'UnSuccessfulUploadedUsers.csv';
          link.href = window.URL.createObjectURL(blob);
          link.textContent = ' ';
          link.dataset.downloadurl = ['text/csv', link.download, link.href].join(':');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.ngxService.stop();
        } else {
          this.ngxService.stop();
        }
      },
      err => {
        if (AppUtills.showErrorMessage(err)) {
          this.facadeService.openArchivedSnackBar(err.statusText || 'Something Went Wrong', 'Retry');
        } else {
          this.modelPopupClose();
        }
        //console.log(err); 
        this.ngxService.stop();
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
    this.facadeService.openArchivedSnackBar(this.data.tosterMsg, 'Success');
    this.dialogRef.close();
    this.redirectTo(this.router.url);
  }

  ngOnDestroy() {
    this.downloadUnsuccessFullFileSubscription ? this.downloadUnsuccessFullFileSubscription.unsubscribe() : '';
  }

}
