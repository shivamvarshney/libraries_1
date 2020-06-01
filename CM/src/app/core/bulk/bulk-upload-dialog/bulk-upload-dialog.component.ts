import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileHandle } from '@src/shared/directive/dragDrop.directive';
import { FacadeService } from '@src/core/services/facade.service';
import { Router } from '@angular/router';
import { BulkConfirmationDialogService } from '../bulk-confirmation/bulk-confirmation.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
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
  fileUploadError:string;
  fileUploadErrorCheck:boolean = false;
  buttonDisabled:boolean = false;
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
    if(dropContainer !== null) {
      dropContainer.ondragover = dropContainer.ondragenter = (evt) => {
        this.fileToUpload = evt.dataTransfer.files[0];
        evt.preventDefault();
      };
      dropContainer.ondrop = (evt) => {
        this.fileToUpload = evt.dataTransfer.files[0];
        if(this.fileToUpload) {
          this.filetxt = this.fileToUpload.name
        } 
        //console.log('this.evt = ', this.fileToUpload);
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
      this.filetxt = file.name;
      var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
      let fileExtCheck = false;
      if (ext.toLowerCase() == 'csv') {
        fileExtCheck = true;
      }
      else if (ext.toLowerCase() == 'xlsx') {
        fileExtCheck = true;
      }      
      if(fileExtCheck){
        this.fileUploadErrorCheck = false;
        this.fileUploadError = '';
        this.fileToUpload = file;
        this.buttonDisabled = true;
        return true;
      }else{
        this.fileUploadErrorCheck = true;
        this.buttonDisabled = false;
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

  // blackListed(currectSelectedText) {
  //   this.data = {
  //     title: this.translate.instant('cp_file') + this.translate.instant(currectSelectedText),
  //     currentSelected: this.translate.instant(currectSelectedText)
  //   }    
  //   this.data.blacklistStatus = false;
  // }

  uploadFile(bulkRoleName: string) {
    this.ngxService.start();
    let roleEntity;
    const formData: FormData = new FormData();
    formData.set('file', this.fileToUpload);
    this.data.currentSelected ? (roleEntity = this.data.currentSelected,formData.set('resource', 'black_listing')) : (roleEntity = bulkRoleName['bulkRoleName'],formData.set('role', roleEntity),formData.set('resource', 'entity'));
     this.cpUploadFileUnsubscribe = this.facadeService.onPostAPI(apiUrls.cpUploadFile, formData).subscribe(res => {
      let data;
      this.ngxService.stop();
      data = res.body || res;
      if ((data.statusCode == 200) && data.message) {
        let downloadFileLink = '';
        if (data.result && data.result.links && data.result.links.length > 0 && data.result.links[0].href) {
          downloadFileLink = data.result.links[0].href
        }        
        this.bulkConfirmationDialogService.openCommonModal({
          title: "Choose File to Upload",
          isUnsuccess: true,
          tosterMsg: data.message,
          unsuccessUsersFile: downloadFileLink,
          totalRecord: data.uploadedFile
        });
        this.modelPopupClose();
      }else{
        this.facadeService.openArchivedSnackBar(data.message, 'Retry');
      }
    },err => {
      if(AppUtills.showErrorMessage(err)){
        this.facadeService.openArchivedSnackBar('Something Went Wrong', 'Retry');
      }
    });
  }

  // close popup model
  modelPopupClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.cpUploadFileUnsubscribe ? this.cpUploadFileUnsubscribe.unsubscribe() : '';
  }

}
