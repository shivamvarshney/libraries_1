import { Component } from '@angular/core';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  config: NgxUiLoaderConfig;
  constructor(private ngxUiLoaderService: NgxUiLoaderService, private translate: TranslateService){ 
    this.config = this.ngxUiLoaderService.getDefaultConfig();
    translate.setDefaultLang('en'); // fr
  }

  // translation
  useLanguage(language: string) {
    this.translate.use(language);
  }
}
