import { Injectable } from '@angular/core';
import { Design } from './question';
import { Font } from 'ngx-font-picker';

@Injectable({
  providedIn: 'root',
})
export class FormDesignService {
  design: Design = {
    answer: '',
    background: '',
    button: '',
    card: '',
    font: '',
    name: '',
    question: '',
  };
  public font: Font = new Font({
    family: '',
    size: '14px',
    style: 'regular',
    styles: ['regular'],
  });

  getFont(font: string): void {
    this.font.family = font;
  }
}
