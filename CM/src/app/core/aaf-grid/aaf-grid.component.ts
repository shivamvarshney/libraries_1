import { Component, OnInit, ViewChild, Input, HostListener, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AafGridDataProvider } from '@src/core/aaf-grid/aaf-grid-data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';
import { ActionsProvider } from './actions-provider';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aaf-grid',
  templateUrl: './aaf-grid.component.html',
  styleUrls: ['./aaf-grid.component.css'],
  providers: [AafModelService]
}) 
export class AafGridComponent<T> implements OnInit,OnDestroy {
  // All the configuration need to pass in Config variable 
  @Input() config: any;
  // All the Data Source need to pass as in DataProvider Form
  @Input() dataProvider: AafGridDataProvider<T>;
  // Here we are definng all the action Providers
  @Input() actionProvider: ActionsProvider;

  getDataSubscription: Subscription;
  norecordFound:string = 'No Record Found';
  displayingColumns: any;
  displayingDataSource: any;
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
  rootClasses: any;
  paginationObj = {
    totalCount: 0,
    pageNo: 0,
    pageSize: 10
  }
  listActions: any;
  filterInformation:any = '';
  //@HostListener('window:resize', ['$event'])
  // For Angular Pagination we need ref of MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // For Angular Sorting we need ref of MatSort
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;
  // Event Handlers pass from Configuration will going to assign on these defined variables
  backEvent: any;
  doFilter: any;
  objectColumn: any;
  stringInfo: string = '';
  constructor(
    private location: Location,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private activatedRoutes:ActivatedRoute
  ) { }

  isTypeArray(value): boolean {
    return (value.constructor === Array);
  }

  isTypeObj(value) {
    return (typeof value === 'object' && value.constructor != Array);
  }

  checkInfo(element, arrayData): boolean {
    //console.log('hello ',element,' and arrayData is ',arrayData);
    this.stringInfo = '';
    let updatedString = '';
    if (element) {
      let expldoedString = element.split(' ');
      expldoedString.map((val, key) => {
        if (val == '-') {
          updatedString += ' - ';
        } else {
          if(this.isTypeArray(arrayData)){
            if(arrayData.length > 0){
              let finalUpdatedString = [];
              arrayData.map((arrayVal)=>{
                finalUpdatedString.push(arrayVal[element]);
              });
              updatedString += finalUpdatedString.join(', ');              
            }
          }else{
            if(arrayData[val] && arrayData[val] != ''){
              updatedString += ' ' + arrayData[val];  
            }  
          }                    
        }
      });
    }    
    this.stringInfo = updatedString
    return true;
  }
  // Return boolean to check Object type 
  isObj(columnName) {
    let returnObj = false;
    if (this.objectColumn.length > 0) {
      this.objectColumn.map((val, key) => {
        if (val.name == columnName) {
          returnObj = true;
        }
      });
    }
    return returnObj;
  } 
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
    this.rootClasses = this.config.rootClasses;
    // All Events need to asign here
    this.backEvent = this.listHeader.backInfo.action;
    this.doFilter = this.filterInfo.searchAction;
    this.listActions = this.actionProvider;
    this.objectColumn = this.config.objectColumn;
    if ((this.listingType == 'usersData') || (this.listingType == 'users') || (this.listingType == 'role')) {
      this.diffrentiateAssignKits = true
    } else {
      this.diffrentiateAssignKits = false
    }
    // We require dataSource here So we need to call getListData function from ngOnIt
    let paginationObj = { size: this.paginationObj.pageSize, page: this.paginationObj.pageNo };
    this.filterInformation = '';
    this.getListData({}, paginationObj);
  }
  // For redirection 
  handleRedirection(eventValue) { 
    let preparedArray = [];
    preparedArray.push('/');
    this.config.customFilters.redirection.map(val => {
      preparedArray.push(val);
    });
    if (eventValue != '' && eventValue != 'all') {
      preparedArray.push(eventValue);
    }

    let navigatioonCheck = true;
    if(this.config.customFilters.queryParams){      
      this.activatedRoutes.queryParams.subscribe((params:Params)=>{        
        let allKeys = Object.keys(params);
        if(allKeys && allKeys.length > 0){
          let objectData = {};          
          allKeys.map((va,ke)=>{            
            if(params[allKeys[ke]] && params[allKeys[ke]] != ''){
              objectData[va] =  params[allKeys[ke]];         
            }
          });
          if(Object.keys(objectData).length > 0){
            navigatioonCheck = false;
            this.router.navigate(preparedArray,{ queryParams: objectData });
          }
        }
      });      
    }
    if(navigatioonCheck){
      this.router.navigate(preparedArray);
    }    
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }
  prepareFirstPagePagingObj() {
    this.paginationObj.pageNo = 0;
    this.paginationObj.pageSize = 10;
  }
  // Take caring of all actions
  handleActions(actionName?: any, actionRow?: any, actionValue?: any) {
    let actionInfo = { row: actionRow, dataInfo: actionValue };
    this.listActions[actionName](actionInfo);
  }
  // Prepare Pagination Obj
  prepareFirstPagePagination() {
    return { size: this.paginationObj.pageSize, page: this.paginationObj.pageNo };
  }
  // On SUbmit of All Filters
  onSubmit(filterData: any) {
    this.filterInformation = filterData;    
    this.getListData(filterData, this.prepareFirstPagePagination());
  }
  // Call to Fetch Data commonly
  getListData(filterInfo?: any, pagingInfo?: any) {
    this.ngxService.start();
    let queryDataObj = { 'fiterData': filterInfo, 'pageInfo': pagingInfo };
    this.getDataSubscription = this.dataProvider.getData(queryDataObj).subscribe(
      resp => {
        this.ngxService.stop();
        if (resp.result && resp.result.rows) {
          this.data = new MatTableDataSource(resp.result.rows);
          this.paginationObj.totalCount = resp.result.totalRows;
          this.paginationObj.pageSize = resp.result.pageSize;
          this.paginationObj.pageNo = resp.result.pageIndex;
          this.refreshConfiguration();
        } else {
          this.norecordFound = resp.message;
          this.data = '';
        }        
      },
      err => {
        this.data = '';
      }
    );
  }
  // On Page Change Event
  onPageChange(eventData: any) {
    this.paginationObj = {
      totalCount: eventData.length,
      pageNo: eventData.pageIndex,
      pageSize: eventData.pageSize
    }
    this.getListData(this.filterInformation, this.prepareFirstPagePagination());
  }
  // Prepare DataSource in the Array as per the Listing requirment
  getDataSource(dataSource: any) {
    let finalUpdatedDataSource = new Array();
    finalUpdatedDataSource['dataSource'] = dataSource;
    return finalUpdatedDataSource;
  }
  // Do refresh all the Listing configuration
  refreshConfiguration() {
    //this.data.paginator = this.paginator;
    this.data.sort = this.sort;
    this.selection = new SelectionModel(true, []);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
  // Advance Search button
  advanceSearch() {
    this.advancedSearch = true;
    this.advanceFilter = !this.advanceFilter;
  }
  // Back to Dashboard page
  backToPreviousPage():void {
    this.router.navigate(this.listHeader.backInfo.redirectionRoute);
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
  ngOnDestroy() {        
    this.getDataSubscription ? this.getDataSubscription.unsubscribe() : '';
  }
}