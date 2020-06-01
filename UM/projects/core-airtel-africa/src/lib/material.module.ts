import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {
  MatSortModule, 
  MatButtonModule,
  MatCardModule, 
  MatDialogModule, 
  MatInputModule,
  MatToolbarModule, 
  MatMenuModule, 
  MatIconModule, 
  MatProgressSpinnerModule, 
  MatGridListModule, 
  MatPaginatorModule,
  MatFormFieldModule,
  MatDividerModule,
  MatTooltipModule
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
    MatTooltipModule
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
    MatTooltipModule
    //MAT_DIALOG_DEFAULT_OPTIONS
  ],
}) 
export class MaterialModules { }

