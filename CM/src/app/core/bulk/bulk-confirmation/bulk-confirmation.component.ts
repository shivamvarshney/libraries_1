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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BulkCOnfirmationComponent>,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private router: Router) { }

  ngOnInit() {
     
  }
  downloadUploadedCSV() {
    this.ngxService.start();
    let downloadObj = {'opcoCode':apiUrls.opco};
    this.unsuccessUsersFileSubscribe = this.facadeService.onCMPostAPI(this.data.unsuccessUsersFile, downloadObj).subscribe(
      (resp: any)=>{
        this.ngxService.stop();
        let data = resp.body;
        if((data.statusCode == 200) && data.result ){                    
          let objectData = AppUtills.decode(resp.body.result);    
          const blob = new Blob([objectData], { type: 'text/csv' });    
          var link = document.createElement('a');
          link.download = 'UnSuccessfulUploadedUsers.csv';
          link.href = window.URL.createObjectURL(blob);
          link.textContent = ' ';          
          link.dataset.downloadurl = ['text/csv', link.download, link.href].join(':');          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);          
        }else{
          this.ngxService.stop();
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }        
      },
      err=>{
        console.log(err);
        this.ngxService.stop();
      },
      ()=>{        
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
  }
  ngOnDestroy() {
    this.unsuccessUsersFileSubscribe ? this.unsuccessUsersFileSubscribe.unsubscribe() : '';
  }

}
