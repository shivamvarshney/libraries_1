import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideshowModule } from 'ng-simple-slideshow';
import { TranslateModule} from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModules } from 'src/app/core/material.module';
import { LoginRoutingModule } from './login.routing.module';
import { LoginComponent } from './login.component';
import { LangSelectionComponent } from './lang-selection/lang-selection.component';


@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        SlideshowModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModules,
    ],
    declarations: [
        LoginComponent,
        LangSelectionComponent
    ]
})
export class LoginModule {}