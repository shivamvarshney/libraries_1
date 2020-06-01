import { Component, OnInit } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lang-selection',
  templateUrl: './lang-selection.component.html',
  styleUrls: ['./lang-selection.component.css']
})
export class LangSelectionComponent implements OnInit {

  selectedLang:string= 'en';
  constructor(private translate: TranslateService) { 

  }

  ngOnInit() {

  }

  setLanguage(value){
    AppUtills.removeValue('language');    
    AppUtills.setValue('language', value);
    this.selectedLang = value;
    this.setTranslationLang();
    return true;
  }

  setTranslationLang(){
    let lang = AppUtills.getValue('language');
    this.translate.use(lang);
  }

}
