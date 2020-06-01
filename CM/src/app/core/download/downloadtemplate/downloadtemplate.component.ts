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
  fileUrl;
  downloadSampleUnsubscribe: Subscription;
  constructor(
    private facadeService: FacadeService,
    private ngxService: NgxUiLoaderService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  downloadSampleCSVFiles() {
    let downloadParams: string;
    this.ngxService.start();
    let cardTxt = this.translate.instant(this.downloadInfo.cardText);
    if (this.downloadInfo.resource === 'entity') {
      downloadParams = "?resource=" + this.downloadInfo.resource + "&role=" + cardTxt + "";
    } else {
      downloadParams = "?resource=" + this.downloadInfo.resource;
    }
    let downloadObj = { 'opcoCode': apiUrls.opco };

    this.downloadSampleUnsubscribe = this.facadeService.onCMPostAPI(apiUrls.cpDownloadSampleFile + downloadParams, downloadObj).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        let data = resp.body;
        if ((data.statusCode == 200) && data.result) {
          let objectData = AppUtills.decode(data.result);
          const blob = new Blob([objectData], { type: 'text/csv' });
          var link = document.createElement('a');
          link.download = this.downloadInfo.sampleTemplateName;
          link.href = window.URL.createObjectURL(blob);
          link.textContent = ' ';
          link.dataset.downloadurl = ['text/csv', link.download, link.href].join(':');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          this.ngxService.stop();
          this.facadeService.openArchivedSnackBar(data.message, 'Retry');
        }
      },
      err => {
        //console.log(err);
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    )
  }

  ngOnDestroy() {
    this.downloadSampleUnsubscribe ? this.downloadSampleUnsubscribe.unsubscribe() : '';
  }

}
