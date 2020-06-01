import { Component, OnInit, Input } from '@angular/core';
import { BulkUploadDialogService } from './bulk-upload-dialog/bulk-upload-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bulk',
  templateUrl: './bulk.component.html',
  styleUrls: ['./bulk.component.css']
})
export class BulkComponent implements OnInit {
  public getApiURLs;
  public error;
  public httpUrl: string;
  uploadContext: string = "Upload"
  @Input() bulkData: any;

  constructor(private commonDialogService: BulkUploadDialogService,
    private translate: TranslateService) { }

  ngOnInit() {

  }

  openModals() {
    this.commonDialogService.openCommonModal({      
      uplaodBulkInfo:this.bulkData.bulk.upload      
    });
  }
}
