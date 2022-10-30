import { BasicEnv } from '../logic/logic';
import { Q, Next, QuestionType } from './questions';
import {
  DEFAULT_EMAIL,
  DEFAULT_MC,
  DEFAULT_NUMBER,
  DEFAULT_PC,
  DEFAULT_PHONE,
  DEFAULT_STAR,
  DEFAULT_TEXT,
  DEFAULT_YN,
} from './q-defaults';

const next: Next = 42;

describe('Multiple Choice question', () => {
  const q = new Q(DEFAULT_MC());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });
  it('should return MultipleChoiceQ as type', () => {
    expect(q.conf.type).toBe(QuestionType.MultipleChoiceQ);
  });
});

describe('Picture Choice question', () => {
  const q = new Q(DEFAULT_PC());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });
  it('should return PictureChoice as type', () => {
    expect(q.conf.type).toBe(QuestionType.PictureChoiceQ);
  });
});

describe('Yes/No question', () => {
  const q = new Q(DEFAULT_YN());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });
  it('should return YesNoQ as type', () => {
    expect(q.conf.type).toBe(QuestionType.YesNoQ);
  });
});

describe('Star Rating question', () => {
  const q = new Q(DEFAULT_STAR());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });
  it('should return StarRatingQ as type', () => {
    expect(q.conf.type).toBe(QuestionType.StarRatingQ);
  });
});

describe('Num question', () => {
  const q = new Q(DEFAULT_NUMBER());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });
  it('should return NumQ as type', () => {
    expect(q.conf.type).toBe(QuestionType.NumberQ);
  });
});

describe('Text question', () => {
  const q = new Q(DEFAULT_TEXT());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });
  it('should return TextQ as type', () => {
    expect(q.conf.type).toBe(QuestionType.TextQ);
  });
});

describe('PhoneNumber question', () => {
  const q = new Q(DEFAULT_PHONE());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });
  it('should return PhoneNumberQ as type', () => {
    expect(q.conf.type).toBe(QuestionType.PhoneNumberQ);
  });
});

describe('Email question', () => {
  const q = new Q(DEFAULT_EMAIL());
  q.conf.def = next;

  it('should encode and decode to JSON and continue to have working logic', () => {
    const test = Q.fromJSON(JSON.parse(JSON.stringify(q)));
    expect(test.next(new BasicEnv(), 0)).toBe(42);
  });

  it('should return EmailQ as type', () => {
    expect(q.conf.type).toBe(QuestionType.EmailQ);
  });
});
