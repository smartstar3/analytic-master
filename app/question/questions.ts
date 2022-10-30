import { If, Jump } from '../logic/jump';
import { Env, interpCondition } from '../logic/logic';

export enum QuestionType {
  MultipleChoiceQ = 0,
  PictureChoiceQ = 1,
  YesNoQ = 2,
  StarRatingQ = 3,
  NumberQ = 4,
  TextQ = 5,
  PhoneNumberQ = 6,
  EmailQ = 7,
  OpenQ = 8,
  SliderChoiceQ = 9,
  AddressQ = 10,
}

export type Settings = QuestionGenerals & Partial<QuestionSpecifics>;

type QuestionSpecifics = NumberSpecifics &
  MultipleChoiceSpecifics &
  PictureChoiceSpecifics &
  TextSpecifics &
  SliderSpecifics &
  StarSpecifics &
  OpenSpecifics &
  EmailSpecifics &
  PhoneSpecifics &
  AddressSpecifics;

export type Next = Jump | 'next';

export type Description = DescriptionPart[];
export type DescriptionPart = string | number;

export type BuilderDescription = BuilderDescriptionPart[];
export type BuilderDescriptionPart = string | { qid: string };

interface QuestionGenerals {
  description: Description | BuilderDescription;
  jumps: If[];
  def: Next;
  type: QuestionType;
}

interface NumberSpecifics {
  min: number;
  max: number;
  placeholder: string;
}

interface OpenSpecifics {
  placeholder: string;
}

interface EmailSpecifics {
  placeholder: string;
}

interface PhoneSpecifics {
  placeholder: string;
}

interface SliderSpecifics {
  min: number;
  max: number;
  value: number;
  color: string;
}

// future refactor: rename all max to 'stars' or 'amount' or `value` (it's not like there is a max or min here)
interface StarSpecifics {
  rating: string;
  color: string;
  max: number;
}

interface MultipleChoiceSpecifics {
  allowMultiple: boolean;
  choices: string[];
}

interface PictureChoiceSpecifics {
  allowMultiple: boolean;
  choices: string[];
  pictures: string[];
}

interface TextSpecifics {
  text: string;
}

interface AddressSpecifics {
  address: string;
}

export class Q {
  constructor(public conf: Settings) {}

  static fromJSON(obj: Q): Q {
    // to allow for backwards compatibility
    // if the description is a string (OLD VERSION), turn it into a single element array
    if (typeof obj.conf.description === 'string') {
      obj.conf.description = [obj.conf.description];
    }
    return new this(obj.conf);
  }

  next(env: Env<string | number>, q: number): Jump {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (const jump of this.conf.jumps) {
      const next = interpCondition(jump.condition, env) ? jump.then : null;
      if (next !== null) return next;
    }
    if (this.conf.def === 'next') {
      return q + 1;
    } else {
      return this.conf.def;
    }
  }
}
