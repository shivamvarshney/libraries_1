import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SalesService } from '@service/sales-service/sales-service.service';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppUtills } from '@src/core/utills/appUtills';
import { DataService } from '@service/data-share-service/data.service';

export interface User {
  name: string;
  kitId: string;
}

@Component({
  selector: 'aaf-modal',
  templateUrl: './aaf-modal.component.html',
  styleUrls: ['./aaf-modal.component.scss']
})
export class AafModalComponent implements OnInit {

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AafModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private dataService: DataService
  ) {}

  @Output() onFilter: EventEmitter<any>  = new EventEmitter();

  myControl = new FormControl();
  options: User[] = [
    {name: 'Tim', kitId: '90859584534'},
    {name: 'James', kitId: '90859584535'},
    {name: 'Igor', kitId: '90859584536'},
    {name: 'Mertin', kitId: '90859584534'},
  ];
  filteredOptions: Observable<User[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }
  
  displayFn(user?: User): string | undefined {
    let username: string;
    if(user){ username = user.name +' ('+ user.kitId +')';
    }else{ username = undefined;
    }
    return username;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(userForm: any){    
    userForm['modalResponseType'] = false;
    this.dataService.filter(userForm);
    this.onNoClick();
  }
  
  onSubmit(userForm: any):void {
    userForm['modalResponseType'] = true;
    userForm['modelStatus'] = this.data.modelStatus;
    this.dataService.filter(userForm);
    this.onNoClick();
  }  
}
