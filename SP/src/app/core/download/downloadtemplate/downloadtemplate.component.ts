import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'download-template',
  templateUrl: './downloadtemplate.component.html',
  styleUrls: ['./downloadtemplate.component.css']
})
export class DownloadtemplateComponent implements OnInit, OnDestroy {

  @Input() downloadInfo: any;
  downloadSampleUnsubscribe: Subscription;
  constructor(
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    
  }

  downloadSampleFile() {
    this.ngxService.start();
    let cpDownloadUrl = this.downloadInfo.bulk.download.downloadURL;
    if (this.downloadInfo.bulk.download.queryParams) {
      let cpDownloadUrlUpdated = this.downloadInfo.bulk.download.downloadURL + '?';
      this.downloadInfo.bulk.download.queryParams.map((paramValue, paramKey) => {
        cpDownloadUrlUpdated += paramValue.key + '=' + paramValue.value + '&';
      });
      cpDownloadUrl = cpDownloadUrlUpdated.substring(0, cpDownloadUrlUpdated.length - 1);
    }
    let fileType = 'csv';
    if (this.downloadInfo.bulk.download.fileType == 'zip') {
      fileType = 'blob';
    }
    let downloadObj = { 'opcoCode': apiUrls.opco };
    this.downloadSampleUnsubscribe = this.facadeService.downloadFile(cpDownloadUrl, downloadObj, fileType).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        let fileName = this.downloadInfo.bulk.download.fileName ? this.downloadInfo.bulk.download.fileName : 'SampleFile';
        if (this.downloadInfo.bulk.download.fileType == 'zip') {
          AppUtills.makeZipFile(resp, fileName);
        } else {
          let data = resp.body;
          if ((data.statusCode == 200) && data.result) {
            AppUtills.makeCSV(resp.body.result, fileName);
          } else {
            this.facadeService.openArchivedSnackBar(data.message, 'Retry');
          }
        }
      },
      err => {
        if (AppUtills.showErrorMessage(err)) {
          this.facadeService.openArchivedSnackBar('Something Went Wrong', 'Retry');
        }
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      });
  }

  ngOnDestroy() {
    this.downloadSampleUnsubscribe ? this.downloadSampleUnsubscribe.unsubscribe() : '';
  }
}
