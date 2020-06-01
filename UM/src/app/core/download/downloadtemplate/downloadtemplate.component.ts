import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FacadeService } from '@src/core/services/facade.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { Subscription } from 'rxjs';

@Component({
  selector: 'download-template', 
  templateUrl: './downloadtemplate.component.html',
  styleUrls: ['./downloadtemplate.component.css']
})
export class DownloadtemplateComponent implements OnInit,OnDestroy {

  @Input() downloadInfo: any;
  fileUrl;
  downloadSampleFile:Subscription;

  constructor(
    private facadeService : FacadeService,
    private ngxService: NgxUiLoaderService
  ) { 

  }

  ngOnInit() { 
    //this.downloadSampleCSVFiles();
  }

  downloadSampleCSVFiles() {
    this.ngxService.start();
    let downloadObj = {'opcoCode':apiUrls.opco};
    this.downloadSampleFile = this.facadeService.onUserPostAPI(apiUrls.downloadFile, downloadObj).subscribe(
      (resp: any)=>{
        let data = resp.body || resp;
        if(data.statusCode == 200){                    
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
          this.ngxService.stop();          
        }else{
          this.ngxService.stop();
        }        
      },
      err=>{
        //console.log(err);
        this.ngxService.stop();
      },
      ()=>{        
        this.ngxService.stop();
      }
    )
  }
  ngOnDestroy() {        
    this.downloadSampleFile ? this.downloadSampleFile.unsubscribe() : '';
  }

}
