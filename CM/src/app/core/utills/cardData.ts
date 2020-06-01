import { apiUrls } from './apiEndPoints';
import { AppConstants } from './constant';
export const CardDataStore = {
    cardInfo: [
        {
          image: "bulk-upload-kits.svg",
          totalNum: "",
          cardText: "cp_dashboard_card_bulk_upload_agent",
          bulkStatus: true,
          resource: "entity",
          redirectUrl: "",
          downloadImage: "download-template.svg",  
          downloadTitle: "user_dashboard_card_download_template",
          selectAgg: "",
          endPoint: apiUrls.cpDownloadSampleFile,
          sampleFileType: "text/csv",
          sampleTemplateName: AppConstants.sampleUserTemplate,
          blacklisted: false,
          moduleName: "CP",
          permissionName: ""
        },
        {
          image: "bulk-upload-kits.svg",
          totalNum: "",
          cardText: "cp_dashboard_card_bulk_upload_freelancer_aggregators",
          bulkStatus: true,
          resource: "entity",
          redirectUrl: "",
          downloadImage: "download-template.svg",  
          downloadTitle: "user_dashboard_card_download_template",
          endPoint: apiUrls.cpDownloadSampleFile,
          sampleFileType: "text/csv",
          sampleTemplateName: AppConstants.sampleUserTemplate,
          blacklisted: false,
          moduleName: "CP",
          permissionName: ""
        },
        {
          image: "bulk-upload-kits.svg",
          totalNum: "",
          cardText: "cp_dashboard_card_bulk_upload_aggregators",
          bulkStatus: true,
          resource: "entity",
          redirectUrl: "",
          downloadImage: "download-template.svg",  
          downloadTitle: "user_dashboard_card_download_template",
          endPoint: apiUrls.cpDownloadSampleFile,
          sampleFileType: "text/csv",
          sampleTemplateName: AppConstants.sampleUserTemplate,
          blacklisted: false,
          moduleName: "CP",
          permissionName: ""
        },
        {
          image: "bulk-upload-kits.svg",
          totalNum: "",
          cardText: "cp_dashboard_card_bulk_upload_blacklisted",
          bulkStatus: true,
          resource: "black_listing",
          redirectUrl: "",
          downloadImage: "download-template.svg",  
          downloadTitle: "user_dashboard_card_download_template",
          selectAgg: "cp_dashboard_card_bulk_upload_select_aggregator",
          endPoint: apiUrls.cpDownloadSampleFile,
          sampleFileType: "text/csv",
          sampleTemplateName: AppConstants.sampleUserTemplate,
          blacklisted: true,
          moduleName: "CP",
          permissionName: ""
        },
        {
          image: "bulk-upload-kits.svg",
          totalNum: "",
          cardText: "cp_dashboard_card_bulk_upload_edit_agent",
          bulkStatus: true,
          resource: "entity",
          redirectUrl: "",
          downloadImage: "download-template.svg",  
          downloadTitle: "user_dashboard_card_download_template",
          endPoint: apiUrls.cpDownloadSampleFile,
          sampleFileType: "text/csv",
          sampleTemplateName: AppConstants.sampleUserTemplate,
          blacklisted: false,
          moduleName: "CP",
          permissionName: ""
        },
        {
          image: "bulk-upload-kits.svg",
          totalNum: "",
          cardText: "cp_dashboard_card_bulk_upload_edit_aggregators",
          bulkStatus: true,
          resource: "entity",
          redirectUrl: "",
          downloadImage: "download-template.svg",  
          downloadTitle: "user_dashboard_card_download_template",
          endPoint: apiUrls.cpDownloadSampleFile,
          sampleFileType: "text/csv",
          sampleTemplateName: AppConstants.sampleUserTemplate,
          blacklisted: false,
          moduleName: "CP",
          permissionName: ""
        },
        {
          image: "bulk-upload-kits.svg",
          totalNum: "",
          cardText: "cp_dashboard_card_bulk_upload_edit_freelancer_aggregators",
          bulkStatus: true,
          resource: "entity",
          redirectUrl: "",
          downloadImage: "download-template.svg",  
          downloadTitle: "user_dashboard_card_download_template",
          endPoint: apiUrls.cpDownloadSampleFile,
          sampleFileType: "text/csv",
          sampleTemplateName: AppConstants.sampleUserTemplate,
          blacklisted: false,
          moduleName: "CP",
          permissionName: ""
        }
      ],
      cardInfotxt:[
        {
          image: "blacklisted.svg",
          totalNum: "100",
          cardText: "user_dashboard_card_black_listed",
          bulkStatus: false,
          redirectUrl: "/channel-partner/blacklisted", 
          moduleName: "CP",
          permissionName: 1
        },
        {
          image: "agents.svg",
          totalNum: "101",
          cardText: "user_dashboard_card_agents",
          bulkStatus: false,
          redirectUrl: "/channel-partner/agents",
          moduleName: "CP",
          permissionName: 2
        },
        {
          image: "freelance_agents.svg",
          totalNum: "102",
          cardText: "user_dashboard_card_free_agent",
          bulkStatus: false,
          redirectUrl: "/channel-partner/freelance-agents",
          moduleName: "CP",
          permissionName: 3
        },
        {
          image: "blacklisted.svg",
          totalNum: "103",
          cardText: "user_dashboard_card_aggregator",
          bulkStatus: false,
          redirectUrl: "/channel-partner/aggregators",
          moduleName: "CP",
          permissionName: 4
        },
        {
          image: "freelance_agents.svg",
          totalNum: "104",
          cardText: "user_dashboard_card_free_aggr",
          bulkStatus: false,
          redirectUrl: "/channel-partner/freelance-aggregators",
          moduleName: "CP",
          permissionName: 5
        },
        {
          image: "aggregator_maping.svg",
          totalNum: "105",
          cardText: "user_dashboard_card_agg_mapping",
          bulkStatus: false,
          redirectUrl: "/channel-partner/aggregator-mappings",
          moduleName: "CP",
          permissionName: 6
        },
        {
          image: "contracts.svg",
          totalNum: "",
          cardText: "user_dashboard_card_contract",
          bulkStatus: false,
          redirectUrl: "/channel-partner",
          moduleName: "CP",
          permissionName: 7
        },
        {
          image: "reports.svg",
          totalNum: "",
          cardText: "user_dashboard_card_report",
          bulkStatus: false,
          redirectUrl: "/channel-partner",
          moduleName: "CP",
          permissionName: 8
        }
      ]
}