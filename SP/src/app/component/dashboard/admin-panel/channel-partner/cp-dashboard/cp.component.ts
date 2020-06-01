import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { FacadeService } from '@src/core/services/facade.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { TranslateService } from '@ngx-translate/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { cardData } from '@src/core/utills/field.interface';
import { PermissionIds } from '@src/core/utills/masterPermission';

const ApiCardDataStore: cardData[] = [
  {
    card: [
      /*
      {
        thumbnail: "bulk-upload-kits.svg",
        text: "Agents",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
        bulk: {
          download: {
            downloadTitle: "Download Template",
            thumbnail: "download-template.svg",
            downloadURL: apiUrls.cpDownloadSampleFile,
            queryParams: [
              { key: "resource", value: "entity" },
              { key: "role", value: "Agent" }
            ],
            fileType: "zip",
            fileName: "AgentTemplate",
            permissionName: PermissionIds.DOWNLOAD_CHANNEL_PARTNER_BULK_UPLOAD_TEMPLATE
          },
          upload: {
            failedDownload: {
              permissionName: PermissionIds.DOWNLOAD_FAILED_RECORDS_FILE_OF_CHANNEL_PARTNER,
              fileType: "text/csv",
              fileName: "FailedAgentTemplate"
            },
            actionLabel:"CHOOSE FILE",
            uploadTitle:"Choose File to Upload Agents",
            errorMessage: "Invalid file provided. Please upload a zip file.",
            fileType: "zip",
            queryParams: [              
              { key: "resource", value: "entity" },
              { key: "role", value: "Agent" }
            ],
            uploadUrl:apiUrls.cpUploadFile      
          }
        }
      },
     */
      /*
      {
        thumbnail: "bulk-upload-kits.svg",
        text: "Aggregators",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
        bulk: {
          download: {
            downloadTitle: "Download Template",
            thumbnail: "download-template.svg",
            downloadURL: apiUrls.cpDownloadSampleFile,
            queryParams: [
              { key: "resource", value: "entity" },
              { key: "cpRole", value: "Aggregator" }
            ],
            fileType: "zip",
            fileName: "AggregatorTemplate",
            permissionName: PermissionIds.DOWNLOAD_CHANNEL_PARTNER_BULK_UPLOAD_TEMPLATE
          },
          upload: {
            failedDownload: {
              permissionName: PermissionIds.DOWNLOAD_FAILED_RECORDS_FILE_OF_CHANNEL_PARTNER,
              fileType: "text/csv",
              fileName: "FailedAggregatorsTemplate"
            },
            actionLabel:"CHOOSE FILE",
            uploadTitle:"Choose File to Upload Aggregators",
            errorMessage: "Invalid file provided. Please upload a zip file.",
            fileType: "zip",
            queryParams: [              
              { key: "role", value: "Aggregator" },
              { key: "resource", value: "entity" }
            ],
            uploadUrl:apiUrls.cpUploadFile     
          }
        }
      },
      */
      {
        thumbnail: "bulk-upload-kits.svg",
        text: "Upload Blacklisted",
        moduleName: "CP",
        permissionName: PermissionIds.BLACKLIST_BULK_UPLOAD,
        bulk: {
          download: {
            downloadTitle: "Download Template",
            thumbnail: "download-template.svg",
            downloadURL: apiUrls.cpDownloadSampleFile,
            queryParams: [
              { key: "resource", value: "black_listing" }
            ],
            fileType: "zip",
            fileName: "BlackListedTemplate",
            permissionName: PermissionIds.DOWNLOAD_BLACKLIST_BULK_UPLOAD_TEMPLATE
          },
          upload: {
            failedDownload: {
              permissionName: PermissionIds.DOWNLOAD_FAILED_RECORDS_FILE_OF_BLACKLIST,
              fileType: "text/csv",
              fileName: "FailedBlackListedTemplate"
            },
            actionLabel: "CHOOSE FILE",
            uploadTitle: "Choose File to Upload Blacklisted",
            errorMessage: "Invalid file provided. Please upload a zip file.",
            fileType: "zip",
            queryParams: [
              { key: "resource", value: "black_listing" }
            ],
            uploadUrl: apiUrls.cpUploadFile
          }
        }
      },
      {
        thumbnail: "bulk-upload-kits.svg",
        text: "Distributor",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
        bulk: {
          download: {
            downloadTitle: "Download Template",
            thumbnail: "download-template.svg",
            downloadURL: apiUrls.cpDownloadSampleFile,
            queryParams: [
              { key: "resource", value: "entity" },
              { key: "role", value: "Distributor" }
            ],
            fileType: "zip",
            fileName: "DistributorTemplate",
            permissionName: PermissionIds.DOWNLOAD_CHANNEL_PARTNER_BULK_UPLOAD_TEMPLATE
          },
          upload: {
            failedDownload: {
              permissionName: PermissionIds.DOWNLOAD_FAILED_RECORDS_FILE_OF_CHANNEL_PARTNER,
              fileType: "text/csv",
              fileName: "FailedDistributorTemplate"
            },
            actionLabel: "CHOOSE FILE",
            uploadTitle: "Choose File to Upload Distributor",
            errorMessage: "Invalid file provided. Please upload a zip file.",
            fileType: "zip",
            queryParams: [
              { key: "resource", value: "entity" },
              { key: "role", value: "Distributor" }
            ],
            uploadUrl: apiUrls.cpUploadFile
          }
        }
      },
      {
        thumbnail: "bulk-upload-kits.svg",
        text: "SIM Distributor",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_BULK_UPLOAD,
        bulk: {
          download: {
            downloadTitle: "Download Template",
            thumbnail: "download-template.svg",
            downloadURL: apiUrls.cpDownloadSampleFile,
            queryParams: [
              { key: "resource", value: "entity" },
              { key: "cpRole", value: "SIM_DISTRIBUTOR" }
            ],
            fileType: "zip",
            fileName: "SIMDistributorTemplate",
            permissionName: PermissionIds.DOWNLOAD_CHANNEL_PARTNER_BULK_UPLOAD_TEMPLATE
          },
          upload: {
            failedDownload: {
              permissionName: PermissionIds.DOWNLOAD_FAILED_RECORDS_FILE_OF_CHANNEL_PARTNER,
              fileType: "text/csv",
              fileName: "FailedSIMDistributorTemplate"
            },
            actionLabel: "CHOOSE FILE",
            uploadTitle: "Choose File to Upload SIM Distributor",
            errorMessage: "Invalid file provided. Please upload a zip file.",
            fileType: "zip",
            queryParams: [
              { key: "role", value: "SIM_DISTRIBUTOR" },
              { key: "resource", value: "entity" }
            ],
            uploadUrl: apiUrls.cpUploadFile
          }
        }
      }
    ]
  },
  {
    card: [
      {
        thumbnail: "blacklisted.svg",
        text: "Blacklisted",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "blacklisted",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },
      {
        thumbnail: "blacklisted.svg",
        text: "Distributor",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "distributor",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },
      {
        thumbnail: "blacklisted.svg",
        text: "SIM Distributor",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "sim_distributor",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },   
      /*
      {
        thumbnail: "agents.svg",
        text: "Agents",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "agent",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },
      */
      /*
      {
        thumbnail: "freelance_agents.svg",
        text: "Freelance Agents",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "freelance agent",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },
      */
      /*
       {
         thumbnail: "blacklisted.svg",
         text: "Aggregetors",
         moduleName: "CP",
         permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
         count: {
           count: 0,
           apiCountVariable: "aggregator",
           redirectUrl: ""//"/channel-partner/freelance-agents",
         }
       }
       */      
      {
        thumbnail: "blacklisted.svg",
        text: "AM Agent",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "am_agent",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },
      {
        thumbnail: "blacklisted.svg",
        text: "Chebeba",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "chebeba",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },
      
      {
        thumbnail: "blacklisted.svg",
        text: "SSO",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "sso",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      },         
      {
        thumbnail: "blacklisted.svg",
        text: "Team Leader",
        moduleName: "CP",
        permissionName: PermissionIds.CHANNEL_PARTNER_COUNT,
        count: {
          count: 0,
          apiCountVariable: "team_leader",
          redirectUrl: ""//"/channel-partner/freelance-agents",
        }
      }
    ]
  }
]

@Component({
  selector: 'cp-dashboard',
  templateUrl: './cp.component.html',
  styleUrls: ['./cp.component.css', '../common-cp.scss']
})

export class CPComponent implements OnInit, OnDestroy {
  cardUpdateInfo: any = [];
  CPSubscription: Subscription;
  apiCardData: cardData[];

  constructor(private ngxService: NgxUiLoaderService,
    private facadeService: FacadeService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.apiCardData = ApiCardDataStore;
    //******** Fetch CP Count ******** //
    this.ngxService.start();
    this.CPSubscription = this.facadeService.onCPGetAPI(apiUrls.cpCount).subscribe(res => {
      let data;
      if (res) {
        this.ngxService.stop();
        data = res.body || res;
        if ((data.statusCode == 200) && data.message) {
          let response = data.result;
          let key, keys = Object.keys(response);
          let n = keys.length;
          let newobj = {}
          while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = response[key];
          }
          /* New update Code */
          this.apiCardData.map((fieldInfo, fieldKey) => {
            this.apiCardData[fieldKey].card.map((cardVal, cardKey) => {
              if (cardVal.count && Object.keys(cardVal.count).length > 0) {
                if (newobj[cardVal.count.apiCountVariable]) {
                  this.apiCardData[fieldKey].card[cardKey].count.count = newobj[cardVal.count.apiCountVariable];
                }
              }
            });
          });
          /* End of the Code for Updating Counter */
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
        }
      }
    }, err => {
      if (AppUtills.showErrorMessage(err)) {
        this.facadeService.openArchivedSnackBar((err.message ? err.message : 'Something Went Wrong'), 'Retry');
      }
    });
  }

  ngOnDestroy() {
    this.CPSubscription ? this.CPSubscription : '';
  }
}
