import { Component, OnInit, Input } from '@angular/core';
import { SalesService } from '@service/sales-service/sales-service.service';
import { BulkUploadDialogService } from './bulk-upload-dialog/bulk-upload-dialog.service';

@Component({
  selector: 'bulk',
  templateUrl: './bulk.component.html',
  styleUrls: ['./bulk.component.css']
})
export class BulkComponent implements OnInit {
  public getApiURLs;
  public error;
  public httpUrl: string;
  @Input() bulkData: any;
  constructor(private salesService: SalesService, private commonDialogService: BulkUploadDialogService) {
    // bulk upload data
    // this.salesService.getConfig().subscribe(data => {
    //   this.getApiURLs = data;
    //   this.httpUrl =  this.getApiURLs.localIP + this.getApiURLs.bulkUpload;
    // }, error => this.error = error);
   }

  ngOnInit() {
  }
  openModals() {
    this.commonDialogService.openCommonModal({
        title: "Choose File to Upload"
    });
  }

}
