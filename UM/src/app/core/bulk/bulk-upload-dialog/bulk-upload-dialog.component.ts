import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileHandle } from '@src/shared/directive/dragDrop.directive';
import { FacadeService } from '@src/core/services/facade.service';
import { Router } from '@angular/router';
import { BulkConfirmationDialogService } from '../bulk-confirmation/bulk-confirmation.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Subscription } from 'rxjs';
import { AppUtills } from '@src/core/utills/appUtills';

@Component({
  selector: 'bulk-upload-dialog',
  templateUrl: './bulk-upload-dialog.html',
  styleUrls: ['./bulk-upload-dialog.css']
})
export class BulkUploadDialogComponent implements OnInit, OnDestroy {
  imagePath: any;
  imgURL: string | ArrayBuffer;
  userId: number = 1;
  file: any;
  fileToUpload;//: File = null;  
  fileUploadError: string;
  fileUploadErrorCheck: boolean = false;
  name = 'file upload';
  files: FileHandle[] = [];
  buldUploadData: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BulkUploadDialogComponent>,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private bulkConfirmationDialogService: BulkConfirmationDialogService,
    private router: Router) { }

  ngOnInit() {
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.fileToUpload = this.files[0].file;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
      let fileExtCheck = false;
      if (ext.toLowerCase() == 'csv') {
        fileExtCheck = true;
      }
      else if (ext.toLowerCase() == 'xlsx') {
        fileExtCheck = true;
      }
      if (fileExtCheck) {
        this.fileUploadErrorCheck = false;
        this.fileUploadError = '';
        this.fileToUpload = file;
        return true;
      } else {
        this.fileUploadErrorCheck = true;
        this.fileUploadError = 'Please upload with CSV, XLSX format';
        return false;
      }
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this.router.navigate([uri])
    );
  }

  uploadFile(inputFile: any) {
    if (this.fileToUpload) {      
      this.ngxService.start();
      const formData: FormData = new FormData();
      formData.set('file', this.fileToUpload);
      this.buldUploadData = this.facadeService.onUserPostAPI(apiUrls.bulkUploadFile, formData).subscribe(res => {
        let data;
        this.ngxService.stop();
        data = res.body || res;
        let downloadFileLink = '';
        if (data.result && data.result.links && data.result.links.length > 0 && data.result.links[0].href) {
          downloadFileLink = data.result.links[0].href;
          this.bulkConfirmationDialogService.openCommonModal({
            title: "Choose File to Upload",
            isUnsuccess: true,
            tosterMsg: data.message,
            unsuccessUsersFile: downloadFileLink,
            totalRecord: data.uploadedFile
          });
          this.modelPopupClose();
        }else{
          this.facadeService.openArchivedSnackBar(data.message || 'Something Went Wrong', 'Retry');
        }
      }, err => {
        if(AppUtills.showErrorMessage(err)){
          this.facadeService.openArchivedSnackBar(err.statusText || 'Something Went Wrong', 'Retry');
        }else{
          this.modelPopupClose();
        }
      });
    }else{
        this.fileUploadErrorCheck = true;      
        this.fileUploadError = 'Please upload with CSV, XLSX format';
    }
  }

  // close popup model
  modelPopupClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.buldUploadData ? this.buldUploadData.unsubscribe() : '';
  }

}
