import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
//import { ChartsModule } from 'ng2-charts';
import { MatListModule } from '@angular/material/list';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaterialModules } from './core/material.module';
import { AppRoutingModule,APP_ROUTES_MODULE_PROVIDER } from './app.routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ValidationsDirective } from 'src/app/shared/directive/validations.directive';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { HttpConfigInterceptor } from './http-interceptor/interceptor';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { SidenavBarComponent } from './shell/sidenav-bar/sidenav-bar.component'
import { SalesService } from './service/sales-service/sales-service.service';
import { SlideshowModule } from 'ng-simple-slideshow';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HeaderComponent } from './shell/header/header.component';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AdminPanelComponent } from '@component/admin-panel.component';
import { MatNativeDateModule } from '@angular/material';
import { CommonDialogComponent } from './shared/common-dialog/common-dialog.component';
import { FilterPipe } from 'src/app/core/pipe/search.filter';
import { DataService } from './service/data-share-service/data.service';
//import { CommonModelService } from '@src/shared/common-model/common-model.service';
import { AafCoreModule } from '@src/core/aaf-core.module';
import { CardModule } from '@src/core/card/card.module';
import { BulkModule } from '@src/core/bulk/bulk.module';
import { DawnloadModule } from '@src/core/download/download.module';
import { ChartModule } from '@src/core/charts/charts.module';
import { SearchModule } from '@src/core/search/search.module';
import { CommonModule } from '@angular/common';
import { AafFormModule } from '@src/core/aaf-form/aaf-form.module';
import { DragDirective } from './shared/directive/dragDrop.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthNGuard } from '@src/auth/authn.guard';
import { AuthZGuard } from '@src/auth/authz.guard';
import { AuthDGuard } from '@src/auth/authd.guard';
import { ExternalZGuard } from '@src/auth/external.guard';
import { SalesServiceModule } from '@src/core/services/sales-service.module';
import { DirectivesModule } from '@src/core/directives/directives.module';
import { AllPipesModule } from '@src/core/pipe/all-pipes.module';
import { MatOptionSelectAllModule } from '@src/core/select-all/mat-select-all.module';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
 
@NgModule({
  declarations: [
    AppComponent,
    ValidationsDirective,
    DashboardComponent,
    SidenavBarComponent,
    HeaderComponent,
    ErrorDialogComponent, 
    PageNotFoundComponent, 
    AdminPanelComponent,
    CommonDialogComponent, 
    FilterPipe, 
    DragDirective
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFileUploadModule,
    MaterialModules,
    NgxUiLoaderModule,    
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatListModule, 
    HttpClientModule,
    NgPipesModule, 
    SlideshowModule,
    ShowHidePasswordModule,
    MatDatepickerModule,
    MatDatepickerModule, 
    MatNativeDateModule, 
    //ChartsModule,
    DirectivesModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AafCoreModule,
    //CoreAirtelAfricaModule,
    CardModule,
    DawnloadModule,
    ChartModule,
    BulkModule,
    SearchModule,
    CommonModule,
    AafFormModule,
    NgxPaginationModule,
    SalesServiceModule,
    AllPipesModule,
    MatOptionSelectAllModule,
    SelectAutocompleteModule
  ],
  entryComponents: [
    ErrorDialogComponent, 
    CommonDialogComponent
  ],
  providers: [
    SalesService, 
    DataService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor,  multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    MatDatepickerModule, 
    AuthNGuard, 
    AuthZGuard,
    AuthDGuard,
    ExternalZGuard,
    //CommonModelService,
    APP_ROUTES_MODULE_PROVIDER
  ],
  bootstrap: [AppComponent],
  exports:[
    //ChartsModule,
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    AafCoreModule,
    CardModule,
    DawnloadModule,
    ChartModule,
    BulkModule,
    SearchModule,
    CommonModule,
    AafFormModule,
    NgxPaginationModule,
    AllPipesModule,
    MatOptionSelectAllModule,
    SelectAutocompleteModule
  ]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
