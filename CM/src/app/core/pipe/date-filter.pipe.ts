import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertToDate'
})
export class ConvertToDate implements PipeTransform {
    transform(value: string): string {
        let cDate = '';
        var d = new Date(value);
        cDate = d.toLocaleDateString();
        return cDate;
    }
}