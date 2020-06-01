import { Component, OnInit, ViewChild, Input, HostListener, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AafGridDataProvider } from '@src/core/aaf-grid/aaf-grid-data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AafModelService } from '@src/core/aaf-modals/aaf-modal.service';
import { ActionsProvider } from './actions-provider';
import { Subscription } from 'rxjs';
import { AppUtills } from '../utills/appUtills';

@Component({
  selector: 'aaf-grid',
  templateUrl: './aaf-grid.component.html',
  styleUrls: ['./aaf-grid.component.css', '../../../aaf-grid.css'],
  providers: [AafModelService]
})
export class AafGridComponent<T> implements OnInit, OnDestroy {
  // All the configuration need to pass in Config variable 
  @Input() config: any;
  // All the Data Source need to pass as in DataProvider Form
  @Input() dataProvider: AafGridDataProvider<T>;
  // Here we are definng all the action Providers
  @Input() actionProvider: ActionsProvider;

  /* Updated Configuration */
  getDataSubscription: Subscription;
  norecordFound: string = 'No Record Found';  
  data: any;
  selection: any;
  paginationObj = {
    totalCount: 0,
    pageNo: 0,
    pageSize: 10
  }
  filterInformation: any = '';
  showSideNav: boolean = true;
  fieldValue: string = '';
  fieldMultiLineObj = [];
  listActions: any;
  headerConfig: any;
  filterConfigs: any;
  actionConfigs: any;
  styleConfigs: any;
  allRowsSelection: any;
  showTableHeader: boolean = false;
  specialCharactors = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '{', '[', '}', ']', '|', '<', ',', '>', '.', '?'];
  // For Angular Pagination we need ref of MatPaginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // For Angular Sorting we need ref of MatSort
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;
  constructor(
    private ngxService: NgxUiLoaderService
  ) { }

  // At initilizing time set configuration also set data source
  ngOnInit() {
    let tokenSource = AppUtills.getValue('ssoSource') ? AppUtills.getValue('ssoSource') : '';
    if (tokenSource == 'iframe') {
      this.showSideNav = false;
    }
    this.headerConfig = this.config.headerConfiguration;
    this.filterConfigs = this.config.filtersConfiguration;
    this.actionConfigs = this.config.actionsConfiguration;
    this.styleConfigs = this.config.styleConfiguration;
    this.listActions = this.actionProvider;
    this.allRowsSelection = this.config.allRowsSelection;
    // We require dataSource here So we need to call getListData function from ngOnIt
    let paginationObj = { size: this.paginationObj.pageSize, page: this.paginationObj.pageNo };
    this.filterInformation = '';
    this.getListData({}, paginationObj);
    this.showGridHeaderRow();
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
  // Do refresh all the Listing configuration
  refreshConfiguration() {
    //this.data.paginator = this.paginator;
    this.data.sort = this.sort;
    this.selection = new SelectionModel(true, []);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
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
  // Validate Actions Using Permissions
  hasPermission(element?:any,data?:any){
    if(element.permissionValidator){
      let actionInfo = { row: element, dataInfo: data };
      if(element.permissionName || element.type === 'toggle'){
        return this.listActions[element.permissionValidator](actionInfo);
      }
    }     
    return true;    
  }  
  // Return boolean to check Object type 
  isObj(columnName, rowData) { 
    this.fieldValue = '';
    this.fieldMultiLineObj = [];
    if (this.headerConfig.multiLineFields) {
      this.headerConfig.multiLineFields.map(nestedField => {
        if (nestedField.key == columnName) {
          this.fieldMultiLineObj = nestedField.fields;
        }
      });
      if(rowData[columnName] && this.fieldMultiLineObj.length > 0 && rowData[columnName].constructor.name == 'Array' && rowData[columnName].length > 0){        
        let arrayMap = [];
        rowData[columnName].map(arrayData=>{
          if(arrayData[this.fieldMultiLineObj[0]]){
            arrayMap.push(arrayData[this.fieldMultiLineObj[0]]);
          }
        });
        if(arrayMap.length > 0){
          this.fieldValue = arrayMap.join();
          this.fieldMultiLineObj = [];
          return false;  
        }                           
      }      
    }    
    if (this.fieldMultiLineObj.length > 0) {
      return true;
    } else {
      let explodedString = this.explodeString(columnName);
      let finalUpdatedString = '';
      if (explodedString.length > 1) {
        for (let k = 0; k < explodedString.length; k++) {
          if (this.specialCharactors.indexOf(explodedString[k]) != -1) {
            finalUpdatedString += explodedString[k] + ' ';
          } else {
            let nestedObj = this.checkIsNestedObj(explodedString[k]);
            let stringVal = '';
            if (nestedObj.length > 1) {
              stringVal = this.getNestedObjValue(nestedObj, rowData);
            } else {
              stringVal = rowData[explodedString[k]];
            }
            finalUpdatedString += stringVal + ' ';
          }
        }
        this.fieldValue = finalUpdatedString;
      } else {
        let nestedObj = this.checkIsNestedObj(columnName);
        if (nestedObj.length > 1) {
          this.fieldValue = this.getNestedObjValue(nestedObj, rowData);
        } else {
          this.fieldValue = rowData[columnName];
        }
      }
    }
    return false;
  }

  getNestedObjValue(nestedObjArr, rowData) {
    let getValueObj = rowData;
    for (let i = 0; i < nestedObjArr.length; i++) {
      if (getValueObj[nestedObjArr[i]]) {
        getValueObj = getValueObj[nestedObjArr[i]];
      }
    }
    if (getValueObj.constructor.name == "Array" || getValueObj.constructor.name == "Object") {
      return '';
    } else {
      return getValueObj; 
    }
  }

  checkIsNestedObj(key) {
    return key.split(".");
  }

  explodeString(key) {
    return key.split(" ");
  }

  showGridHeaderRow(){
    this.showTableHeader = false;
    for(let i=0; i< this.headerConfig.mapping.length; i++){
      if(this.headerConfig.mapping[i].header){
        this.showTableHeader = true;
        break;
      }
    }    
  }
}