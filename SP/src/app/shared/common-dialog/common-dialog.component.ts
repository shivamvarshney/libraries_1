import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileHandle } from '../directive/dragDrop.directive';
import { FacadeService } from '@src/core/services/facade.service';
import { Router } from '@angular/router';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Subscription } from 'rxjs';
import { AppUtills } from '@src/core/utills/appUtills';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent implements OnInit {
  imagePath: any;
  imgURL: string | ArrayBuffer;
  message: string;
  error: string;
  userId: number = 1;
  file: any;
  fileToUpload;//: File = null;
  cpUploadUnsubscribe: Subscription;
  uploadResponse = { status: '', message: '', filePath: '' };

  name = 'file upload';
  files: FileHandle[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CommonDialogComponent>,
    private facadeService: FacadeService,
    private snakeBar: MatSnackBar,
    private ngxService: NgxUiLoaderService,
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
      this.fileToUpload = file;
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(
      () => this.router.navigate([uri])
    );
  }

  uploadFile(bulkRoleName: string) {
    this.ngxService.start();
    const formData: FormData = new FormData();
    formData.set('file', this.fileToUpload);
    formData.set('role', bulkRoleName);
    formData.set('resource', 'entity');
    this.cpUploadUnsubscribe = this.facadeService.onCPPostAPI(apiUrls.cpUploadFile, formData).subscribe(res => {
      let data;
      this.ngxService.stop();
      data = res.body || res;
      if ((data.statusCode == 200) && data.message) {
        this.facadeService.openArchivedSnackBar(data.message, 'Success');
        this.redirectTo(this.router.url);
      }else {
        this.facadeService.openArchivedSnackBar(data.message, 'Retry');
      }
    }, error => {
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar('Something Went Wrong', 'Retry');
      }else{
        this.modelPopupClose();
      }
    });
  }

  // close popup model
  modelPopupClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.cpUploadUnsubscribe ? this.cpUploadUnsubscribe.unsubscribe() : '';
  }
}
