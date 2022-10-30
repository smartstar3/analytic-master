import { Pipe, PipeTransform } from '@angular/core';

export interface Card {
  title: string;
  icon: string;
  text: string;
  path: string;
}

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(cards: Card[], searchTerm: string): Card[] {
    if (!cards || !searchTerm) return cards;
    return cards.filter((card) => card.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
}
