import { QuestionType } from './questions';
import { Env, Primitive } from '../logic/logic';
import { PublishedQuestionService } from '../form/services/published-question.service';
import { ShareInfo } from '../resources/interfaces/share-info.interface';

type State = 'edited' | 'answered';

export class Answers implements Env<number> {
  private answers: _Answer[] = [];
  private ending: number = null;
  constructor(private qs: PublishedQuestionService) {}

  private put(q: number, t: QuestionType, a: Primitive, state: State, valid: boolean): void {
    const finding = this.answers.find((answer) => answer.question === q);
    if (finding) {
      finding.answer = a;
      finding.state = state;
      finding.valid = valid;
    } else {
      this.answers.push({ question: q, type: t, answer: a, state, valid });
    }
  }

  edit(q: number, t: QuestionType, a: Primitive, valid?: boolean): void {
    this.put(q, t, a, 'edited', valid);
  }

  answered(q: number): void {
    const finding = this.find(q);
    if (finding) {
      finding.state = 'answered';
    }
  }

  edited(q: number): boolean {
    const finding = this.find(q);
    return finding && finding.state === 'edited';
  }

  isValid(q: number): boolean {
    const answer = this.find(q);
    if (answer) return answer.valid;
    return false;
  }

  clearTo(q: number): void {
    this.answers = this.answers.filter((answer) => answer.question <= q);
  }

  sliceTo(i: number): void {
    this.answers = this.answers.slice(0, i);
  }

  slice(i: number): _Answer[] {
    return this.answers.slice(0, i);
  }

  splice(start: number, deleteCount?: number): _Answer[] {
    return this.answers.splice(start, deleteCount);
  }

  private find(q: number): _Answer {
    return this.answers.find((answer) => answer.question === q);
  }

  get(q: number): Primitive {
    const finding = this.find(q);
    return finding && finding.answer;
  }

  getString(q: number): string {
    const finding = this.find(q);
    return finding && this.stringify(finding);
  }

  private stringify(a: _Answer): string {
    switch (a.type) {
      case QuestionType.EmailQ:
      case QuestionType.NumberQ:
      case QuestionType.PhoneNumberQ:
      case QuestionType.OpenQ:
      case QuestionType.SliderChoiceQ:
      case QuestionType.StarRatingQ:
        return a.answer.toString();
      case QuestionType.YesNoQ:
        return a.answer ? 'yes' : 'no';
      case QuestionType.MultipleChoiceQ:
      case QuestionType.PictureChoiceQ:
        return (a.answer as number[]).map((i) => this.qs.get[a.question].conf.choices[i]).join(', ');
    }
  }

  array(): Answer[] {
    return this.answers.map((a) => {
      return { question: a.question, type: a.type, answer: a.answer };
    });
  }

  dbReady(): DBAnswers {
    return {
      answers: this.array(),
      end: this.ending,
    };
  }

  end(end: number): void {
    this.ending = end;
  }
}

interface _Answer {
  question: number;
  type: QuestionType;
  answer: Primitive;
  state: State;
  valid: boolean;
}

export interface Answer {
  question: number;
  type: QuestionType;
  answer: Primitive;
}

export interface DBAnswers {
  answers: Answer[];
  end?: number;
  share?: ShareInfo;
}
