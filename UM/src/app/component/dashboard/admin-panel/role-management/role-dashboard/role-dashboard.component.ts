import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppConstants } from '@src/core/utills/constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { Subscription, forkJoin } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { PermissionIds } from '@src/core/utills/masterPermission';


@Component({
  selector: 'role-dashboard',
  templateUrl: './role-dashboard.component.html',
  styleUrls: ['./role-dashboard.component.css']
})
export class RoleDashboardComponent implements OnInit {
  roleCount: string = '0';
  cardInfo: any;
  roleSubscription: Subscription;
  masterDataSubscriber: Subscription;
  public errorMsg: boolean = false;
  constructor(private ngxService: NgxUiLoaderService,
    private facadeService: FacadeService,
    private snakeBar: MatSnackBar, private _http: HttpClient) {
    this.cardInfomation(this.roleCount)
  }
  /*
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    document.getElementById('templateHt').style.height = event.target.innerHeight - 71 + 'px';
  }
  */

  checkRedirectPermission() {
    if (this.facadeService.validateSpecificPermission(PermissionIds.VIEW_ROLE_LISTING)) {
      return true;
    }
    return false;
  }

  cardInfomation(count) {
    this.cardInfo = [
      {
        image: "",
        totalNum: count,
        cardText: "role_dashboard_card_roles",
        bulkStatus: false,
        roleStatus: 'roles',
        redirectUrl: ((this.checkRedirectPermission() && (count > 0)) ? "/role" : ''),
        moduleName: 'ROLES',
        permissionName: PermissionIds.ROLE_COUNT
      },
      {
        image: "create_role.svg",
        totalNum: "",
        cardText: "role_dashboard_card_create_role",
        bulkStatus: false,
        roleStatus: 'new',
        redirectUrl: "/role",
        moduleName: 'ROLES',
        permissionName: PermissionIds.CREATE_ROLE
      }
      // {
      //   image: "edit_roles.svg",
      //   totalNum: "",
      //   cardText: "Edit Roles",
      //   bulkStatus: false,
      //   roleStatus: 'roles',
      //   redirectUrl: "/dashboard/role",
      //   moduleName: 'ROLES',
      //   permissionName: 'Edit Role'
      // }
    ]
  }


  lineChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  lineChartColors = [
    {
      borderColor: '#24AEFC',
      backgroundColor: 'transparent',
    },
  ];
  lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  userlineChartData = {
    lineChartData: this.lineChartData,
    lineChartLabels: this.lineChartLabels,
    lineChartColors: this.lineChartColors
  };

  userPieChartData = {
    center_text: '16780',
    center_fill_color_code: 'blue',
    legend_title: 'Totral Roles',
    chartColors: [{
      hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
      hoverBorderWidth: 0,
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
      hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
    }],
    chartLabels: ['Channel Partner', 'Active', 'Inactive'],
    chartData: [300, 50, 100]
  }

  ngOnInit() {
    // ******** Fetch Role Count ******** //
    this.ngxService.start();
    this.roleSubscription = this.facadeService.onRoleGetAPI(apiUrls.roleCount).subscribe(roleRes => {
      let data;
      if (roleRes) {
        this.ngxService.stop();
        data = roleRes;
        if ((data.statusCode == 200) && data.message) {
          let Rolecount = data.result;
          this.roleCount = Rolecount.count;
          this.cardInfomation(this.roleCount);
          this.getAllRMMasterData();
        } else {
          this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
        }
      }
    });
  }

  getAllRMMasterData() {
    let masterData = AppUtills.getValue('masterData');
    let masterSites = AppUtills.getValue('masterSites');
    if ((masterData && masterData != '') && (masterSites && masterSites != '')) {

    } else {
      this.ngxService.start();
      this.masterDataSubscriber = this.facadeService.getRoleMCompleteMasterData().subscribe(
        (masterResp: any) => {
          if (masterResp) {
            masterResp.map((value, key) => {
              if (value.statusCode == 200 && value.result) {
                if (key == 1) {
                  AppUtills.removeValue('masterSites');
                  AppUtills.setValue('masterSites', JSON.stringify(value.result));
                } else {
                  AppUtills.removeValue('masterData');
                  AppUtills.setValue('masterData', JSON.stringify(value.result));
                }
              }
            });
          }
          this.ngxService.stop();
        },
        err => {
          console.log(err);
          this.ngxService.stop();
        }
      );
    }
  }

  ngOnDestroy() {
    this.roleSubscription ? this.roleSubscription.unsubscribe() : '';
    this.masterDataSubscriber ? this.masterDataSubscriber.unsubscribe() : '';
  }
}
