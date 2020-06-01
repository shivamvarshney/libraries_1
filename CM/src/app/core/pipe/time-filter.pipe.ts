import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertToTime'
})
export class ConvertToTime implements PipeTransform {
    transform(value: string): string {
        let cTime = '';
        var d = new Date(value);
        cTime = d.toLocaleTimeString();
        return cTime;
    }
}