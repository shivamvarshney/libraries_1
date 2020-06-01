import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { FileHandle } from '@src/shared/directive/dragDrop.directive';
import { FacadeService } from '@src/core/services/facade.service';
import { Router } from '@angular/router';
import { BulkConfirmationDialogService } from '../bulk-confirmation/bulk-confirmation.service';
import { TranslateService } from '@ngx-translate/core';
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
  filetxt: string = "Drag and drop your files here";
  fileToUpload;//: File = null;  
  fileUploadError: string;
  fileUploadErrorCheck: boolean = false;
  buttonDisabled: boolean = false;
  cpUploadFileUnsubscribe: Subscription;
  name = 'file upload';
  files: FileHandle[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BulkUploadDialogComponent>,
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private bulkConfirmationDialogService: BulkConfirmationDialogService,
    private router: Router,
    private translate: TranslateService) { }

  ngOnInit() {
    let dropContainer = document.getElementById('dropContainer');
    if (dropContainer !== null) {
      dropContainer.ondragover = dropContainer.ondragenter = (evt) => {
        this.fileToUpload = evt.dataTransfer.files[0];
        evt.preventDefault();
      };
      dropContainer.ondrop = (evt) => {
        this.fileToUpload = evt.dataTransfer.files[0];
        if (this.fileToUpload) {
          this.filetxt = this.fileToUpload.name
        }
        evt.preventDefault();
      };
    }
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
      if (this.data.uplaodBulkInfo.fileType) {
        if (ext.toLowerCase() == this.data.uplaodBulkInfo.fileType) {
          fileExtCheck = true;
        }
      }
      if (fileExtCheck) {
        this.fileUploadErrorCheck = false;
        this.fileUploadError = '';
        this.fileToUpload = file;
        return true;
      } else {
        this.fileUploadErrorCheck = true;
        this.fileUploadError = this.data.uplaodBulkInfo.errorMessage ? this.data.uplaodBulkInfo.errorMessage : 'Please upload with CSV, XLSX format';
        return false;
      }
    }
  }
  
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this.router.navigate([uri])
    );
  }

  uploadFile() {
    if (this.fileToUpload) {
      this.ngxService.start();
      const formData: FormData = new FormData();
      formData.set('file', this.fileToUpload);
      if(this.data.uplaodBulkInfo.queryParams){
        this.data.uplaodBulkInfo.queryParams.map((paramVal,paramKey)=>{
          formData.set(paramVal.key, paramVal.value);
        });
      }
      this.cpUploadFileUnsubscribe = this.facadeService.onCPPostAPI(this.data.uplaodBulkInfo.uploadUrl, formData).subscribe(res => {
        let data;
        this.ngxService.stop();
        data = res.body || res;                
        if(data.result && data.result.hasOwnProperty('successCount') && data.result.hasOwnProperty('failureCount')){
          if (data.result && data.result && data.result.successCount == 0 && data.result.failureCount == 0) {
            this.facadeService.openArchivedSnackBar('Empty File Provided', 'Success');
          }else{
            let responseObj = {
              totalFailureRecord : (data.result.failureCount == 0 || data.result.failureCount > 0) ? data.result.failureCount : 0,
              unsuccessUsersFile: data.result.link ? data.result.link : '',
              totalSuccessRecord: (data.result.successCount == 0 || data.result.successCount > 0) ? data.result.successCount : 0,
            }
            let preparedObj = {
              failedFileObj:this.data.uplaodBulkInfo.failedDownload,
              respObj:responseObj              
            }
            console.log('from upload success ',preparedObj);
            this.bulkConfirmationDialogService.openCommonModal(preparedObj);
            this.modelPopupClose();
          }
        }else{
          this.facadeService.openArchivedSnackBar(data.message ? data.message : 'Something Went Wrong', 'Retry');
        }        
      }, err => {
        if (AppUtills.showErrorMessage(err)) {
          this.facadeService.openArchivedSnackBar(err.statusText || 'Something Went Wrong', 'Retry');
        } else {
          this.modelPopupClose();
        }
      });
    } else {
      this.fileUploadErrorCheck = true;
      this.fileUploadError = this.data.uploadFileTypeError ? this.data.uploadFileTypeError : 'Please upload with CSV, XLSX format';
    }
  }

  // close popup model
  modelPopupClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.cpUploadFileUnsubscribe ? this.cpUploadFileUnsubscribe.unsubscribe() : '';
  }

}
