import { Component, OnInit, Input } from '@angular/core';
import { SalesService } from '@service/sales-service/sales-service.service';
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
    this.translate.instant(this.bulkData.cardText);
  }
  openModals() {
    this.bulkData.blacklisted ? this.uploadContext = '' : this.uploadContext='Upload';
    this.commonDialogService.openCommonModal({
        title: "Choose File to " + this.uploadContext +" "+ this.translate.instant(this.bulkData.cardText),
        bulkRoleName: this.translate.instant(this.bulkData.cardText),
        selectAgg: this.bulkData.selectAgg ? this.translate.instant(this.bulkData.selectAgg): '',
        blacklistStatus: this.bulkData.blacklisted
    });
  }

}
