import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'articleCard'
})
export class ArticleCardPipe implements PipeTransform {

  transform(value: string): string {
    if (value.length <= 250) {
      return value;
    } else {
      return value.slice(0, 230) + '...';
    }
  }
}
