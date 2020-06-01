import { Injectable, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from '@service/data-share-service/data.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';

@Injectable({
  providedIn: 'root'
})
export class SalesService implements OnInit {
  public translationJSON = 'assets/i18n/en.json';

  private messageSource = new BehaviorSubject('default');
  currentMessage = this.messageSource.asObservable();

  count: any;
  error: any;
  um_master_data = [
    {
      dashboard: {
        activeuser: "787",
        inactiveuser: "212",
        username: "Welcome Kennedy",
        usernumber: "0746473722"
      },
      createuserdata: {
        roles: [
          { rolename: "Merchant Recruitment Executive" },
          { rolename: "Sales Admin" },
          { rolename: "Risk of Compliance" },
          { rolename: "Airtel Money Operation Manager" }
        ],
        status: [
          "Active",
          "Inactive",
        ],
        primaryLanguage: [
          { pLang: "Swahili" },
          { pLang: "English" },
          { pLang: "French" }
        ],
        region: [
          { regionname: "Central 1" },
          { regionname: "Central 2" },
          { regionname: "Central 3" }
        ],
        territory: [
          { territoryname: "CBD" },
          { territoryname: "CAD" },
          { territoryname: "CCD" }
        ],
        cluster: [
          { clustername: "Kesiney 1" },
          { clustername: "Kesiney 2" },
          { clustername: "Kesiney 3" }
        ],
        unit: [
          { unitname: "Civic Center 1" },
          { unitname: "Civic Center 2" },
          { unitname: "Civic Center 3" }
        ],
      }
    }
  ]

  activeUserDetails = [
    {
      userdetails: {
        name: "Kennedy Jeroge - A19FDBYO",
        email: "Kennedy@gmail.com",
        number: "0786454627"
      },
      role: "Merchant Sales Executive",
      Subrole: "Business Executive",
      status: [
        "Active",
        "Inactive",
      ],
      userId: "10010"
    },
    {
      userdetails: {
        name: "Kennedy DD - A19FDBYR",
        email: "Kennedd@gmail.com",
        number: "0786454333"
      },
      role: "Merchant Sales",
      Subrole: "Business Executive",
      status: [
        "Active",
        "Inactive",
      ],
      userId: "10011"
    }
  ]

  userKits = [
    {
      "statusCode": 200,
      "message": "kits found successfully.",
      "result": [
        {
          "id": 148,
          "cpId": 0,
          "kitId": 21,
          "salesUserId": 10060,
          "assignmentStartDate": null,
          "assignmentEndDate": null,
          "reasonId": 1,
          "kitStatus": "COLLECTED_FROM_RETAILER",
          "reasonDesc": "string",
          "createdBy": null,
          "createdOn": "2019-07-31T10:05:32.337+0000",
          "updatedBy": null,
          "updatedOn": "2019-07-31T10:05:32.337+0000",
          "salesUserName": "Tim",
          "channelUserName": null
        },
        {
          "id": 148,
          "cpId": 0,
          "kitId": 22,
          "salesUserId": 10061,
          "assignmentStartDate": null,
          "assignmentEndDate": null,
          "reasonId": 1,
          "kitStatus": "COLLECTED_FROM_RETAILER",
          "reasonDesc": "string",
          "createdBy": null,
          "createdOn": "2019-07-31T10:05:32.337+0000",
          "updatedBy": null,
          "updatedOn": "2019-07-31T10:05:32.337+0000",
          "salesUserName": "Tim John",
          "channelUserName": null
        }
      ]
    }
  ]

  constructor(private _http: HttpClient,
    private snakeBar: MatSnackBar,
    private _location: Location,
    private ngxService: NgxUiLoaderService,
    private dataService: DataService) { }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  ngOnInit() {
  }

  //dummyUMData
  fetchUMObj() {
    return this.um_master_data;
  }

  //dummyUMData
  fetchUMUserDetails() {
    return this.activeUserDetails;
  }

  // fetch transslation text from config files
  getTranslation() {
    return this._http.get(this.translationJSON).pipe(retry(3))
  }

  // Post Api Calls
  postAPI(postRequest) {
    return this._http.post(postRequest.url, postRequest.data, { observe: "response" });
  }
  //Get Api Calls
  getAPI(postRequest) {
    return this._http.get(postRequest.url);
  }

  // go to previous routing
  backClicked(): void {
    this._location.back();
  }

  // Toast popup message for response
  openArchivedSnackBar(resMsg: string, action: string) {
    if (resMsg) {
      this.snakeBar.open(resMsg, action, {
        duration: 3000
      });
    }
  }

  // Download Template
  downloadTemplate(data:any){
    return this._http.post(data.endPoint,{});
  }
}
