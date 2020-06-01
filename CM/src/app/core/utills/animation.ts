import { trigger, transition, animate, style } from '@angular/animations';

export class AnimationData {
        addAniInfo() {
            trigger('slideInOut', [
                transition(':enter', [
                  style({transform: 'translateX(-100%)'}),
                  animate('500ms ease-in', style({transform: 'translateX(0%)'}))
                ]),
                transition(':leave', [
                  animate('500ms ease-in', style({transform: 'translateX(-100%)'}))
                ])
              ])
              return this.addAniInfo();
        } 
        
}

