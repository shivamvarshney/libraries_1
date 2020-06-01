import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[outsideClick]',
   host: {
   '(document:click)': 'onClick($event)',
  }
})
export class OutsideClickDirective {

  constructor(private elementRef: ElementRef) { }

  @Output() public outsideClick = new EventEmitter();
  @HostListener('document:click', ['$event.target'])

  onClick(targetElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    console.log('clickedInside is ',clickedInside)
    if (!clickedInside) {
        this.outsideClick.emit(null);
    }    
  }
}