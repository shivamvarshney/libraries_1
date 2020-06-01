import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';

import {  
  MatSortModule, 
  MatButtonModule,
  MatCardModule, 
  MatDialogModule,
  MatToolbarModule, 
  MatMenuModule, 
  MatIconModule, 
  MatProgressSpinnerModule, 
  MatGridListModule, 
  MatPaginatorModule,
  MatFormFieldModule,
  MatDividerModule,
  MatTooltipModule,
  MatListModule,
  MatOptionModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatChipsModule,   
  MatExpansionModule,      
  MatRippleModule,    
  MatSidenavModule,
  MatSliderModule
} from '@angular/material'; //MAT_DIALOG_DEFAULT_OPTIONS

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatInputModule,
    MatRadioModule,
    MatMomentDateModule,
    MatListModule,
    MatOptionModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatChipsModule,   
    MatExpansionModule,      
    MatRippleModule,    
    MatSidenavModule,
    MatSliderModule,
    A11yModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatSelectInfiniteScrollModule
    //MAT_DIALOG_DEFAULT_OPTIONS
  ],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatInputModule,
    MatRadioModule,
    MatMomentDateModule,
    MatListModule,
    MatOptionModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatChipsModule,   
    MatExpansionModule,      
    MatRippleModule,    
    MatSidenavModule,
    MatSliderModule,
    A11yModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatSelectInfiniteScrollModule
    //MAT_DIALOG_DEFAULT_OPTIONS
  ],
}) 
export class MaterialModules { }

