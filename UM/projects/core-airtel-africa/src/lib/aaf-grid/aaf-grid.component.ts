import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AafGridDataProvider } from './aaf-grid-data-provider';
import { kitRowData } from './kits-data';
import { assignedKitRowData }  from './assigned-kits-data';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AafModalService } from '../aaf-modal/aaf-modal.service';

@Component({
  selector: 'aaf-grid',
  templateUrl: './aaf-grid.component.html',
  styleUrls: ['./aaf-grid.component.css'],
  //providers:[ AafModalService ]
})
export class AafGridComponent<T> implements OnInit {
  // All the configuration need to pass in Config variable 
  @Input() config: any;
  // All the Data Source need to pass as in DataProvider Form
  @Input() dataProvider: AafGridDataProvider<T>;
  // Here we are declaring all the variable which requie configuration and need to pass to the HTML
  displayingColumns:any;
  displayingDataSource:any;
  displayedColumns: string[];
  data: any;
  selection: any;
  columns: any;
  checkBoxFunction: boolean = false;
  actionInfo: any;
  filterInfo: any;
  itemPerPage: any;
  listingType: any;
  listHeader: any;
  advancedSearch: boolean = true;
  advanceFilter: boolean = false;
  diffrentiateAssignKits: boolean = false;
  dataSourceInfo: any;
  amount = new FormControl();
  // For Angular Pagination we need ref of MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // For Angular Sorting we need ref of MatSort
  @ViewChild(MatSort) sort: MatSort;

  // Event Handlers pass from Configuration will going to assign on these defined variables
  backEvent: any;
  doFilter: any;
  deleteAssignedKit:any;
  constructor(
    private aafModalService: AafModalService,
    private router: Router, 
    private ngxService: NgxUiLoaderService
  ) { }

  // At initilizing time set configuration also set data source
  ngOnInit() {
    this.displayedColumns = this.config.finalDynamicDisplayColumns;
    this.checkBoxFunction = this.config.functionalityCheckBox;
    this.columns = this.config.columnData;
    this.filterInfo = this.config.customFilters;
    this.actionInfo = this.config.actionAttr;
    this.listingType = this.config.configurationFor;
    this.itemPerPage = this.config.itemPerPage;
    this.listHeader = this.config.listHeader;
    this.dataSourceInfo = this.config.sourceDataInfo;
    // All Events need to asign here
    this.backEvent = this.listHeader.backInfo.action;
    this.doFilter = this.filterInfo.searchAction;
    //deleteAssignedKit
    // We require dataSource here So we need to call getListData function from ngOnIt
    this.getListData();
  }

  // Call to Fetch Data commonly
  getListData() {
    this.ngxService.start();
    this.dataProvider.getData().subscribe(
      resp=>{

      },
      err=>{
        let listRowData;
        if(this.listingType == 'users'){
          listRowData = this.getDataSource(assignedKitRowData);
        }else{
          listRowData = this.getDataSource(kitRowData);
        }
        //console.log(listRowData);
        this.data = new MatTableDataSource(listRowData.dataSource);
        this.refreshConfiguration();
      },
      ()=>{
        this.ngxService.stop();
      }
    );
  } 

  // Prepare DataSource in the Array as per the Listing requirment
  getDataSource(dataSource: any) {
    let finalKitDataSource = new Array();
    finalKitDataSource['dataSource'] = dataSource;
    return finalKitDataSource;
  }

  // Delete Assigned Kit User
  deleteUser(rowData:any){

  }

  // Get all kits as per pagination as well filters
  getkits(filtersInfo: any = '', paginationInfo: any = '') {
    this.getListData();
    this.refreshConfiguration();
  }

  // Get all assigned kits as per pagination as well filters
  getAssignedKits(filtersInfo: any = '', paginationInfo: any = '') {
    this.getListData();
    this.refreshConfiguration();
  } 

  // Do refresh all the Listing configuration
  refreshConfiguration() {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
    this.selection = new SelectionModel(true, []);
    // All Events need to asign here
    this.backEvent = this.listHeader.backInfo.action;

    this.listingType == 'users' ? this.diffrentiateAssignKits = true : this.diffrentiateAssignKits = false; 
    console.log('this.listingType = ', this.listingType);
  }

  advanceSearch(){
    this.advancedSearch = true;
    this.advanceFilter = !this.advanceFilter;
  }

  // Back to Dashboard page
  backToDashboard() {
    this.router.navigateByUrl('/dashboard/kit/panel');
  }

  // Kit Filtering Action
  kitFilters() {
    this.getListData();
  }

  // Assigned Kit Filter Action
  assignedKitFilters() {
    this.getListData();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.data.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
 