import { Q, QuestionType } from 'src/app/question';
import { Primitive } from '../../logic/logic';

export class Counter {
  total = 0;
  private map: { [a: string]: number } = {};

  constructor(question: Q) {
    switch (question.conf.type) {
      case QuestionType.MultipleChoiceQ:
      case QuestionType.PictureChoiceQ:
        question.conf.choices.forEach((choice: string) => this.addChoice(choice));
        break;
      case QuestionType.StarRatingQ:
        for (let i = 0; i < question.conf.max; i++) {
          this.addChoice(`${i + 1}`);
        }
        break;
      case QuestionType.YesNoQ:
        this.addChoice('No');
        this.addChoice('Yes');
        break;
      default:
        throw Error('not supposed to get here');
    }
  }

  private _groups: Group[] = [];

  get groups(): Group[] {
    return [...this._groups];
  }

  count(answer: Primitive): void {
    switch (typeof answer) {
      case 'number':
        this._groups[this.map[answer]].value++;
        break;
      case 'boolean':
        this._groups[answer ? 1 : 0].value++;
        break;
      case 'object':
        // check to make sure answer is an array and not a StringMap
        if (typeof answer.forEach === 'function') {
          answer.forEach((a: string | number | boolean) => (this._groups[a.toString()] as Group).value++);
        }
        break;
      case 'string':
        this._groups[this.map[answer]].value++;
    }
    this.total++;
  }

  setValueZero(): void {
    this._groups = this._groups.filter((group) => group.value > 0);
  }

  private addChoice(choice: string): void {
    this._groups.push({ name: choice, value: 0 });
    this.map[choice] = this._groups.length - 1;
  }
}

export interface Group {
  name: string;
  value: number;
}
