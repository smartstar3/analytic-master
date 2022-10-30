import { QuestionType, Settings } from './questions';

// ----- THESE ARE FACTORY METHODS. YOU HAVE TO CALL THEM. -----

export const DEFAULT_GENERIC = (): Settings => ({
  description: ['New Question'],
  jumps: [],
  def: 'next',
  type: null,
});

export const DEFAULT_YN = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.YesNoQ,
    description: ['New Yes/No Question'],
  });

export const DEFAULT_PC = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.PictureChoiceQ,
    description: ['New Picture Choice Question'],
    choices: [],
    pictures: [],
  });

export const DEFAULT_MC = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.MultipleChoiceQ,
    description: ['New Multiple Choice Question'],
    choices: [],
  });

export const DEFAULT_STAR = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.StarRatingQ,
    description: ['New Star Rating Question'],
    rating: 'star',
    max: 5,
    color: '#ffc107',
  });

export const DEFAULT_SLIDER = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.SliderChoiceQ,
    description: ['New Slider Question'],
    min: 0,
    max: 100,
    value: 0,
  });

export const DEFAULT_NUMBER = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.NumberQ,
    description: ['New Number Question'],
    min: null,
    max: null,
    placeholder: 'Enter a number',
  });

export const DEFAULT_PHONE = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.PhoneNumberQ,
    description: ['New Phone Number Question'],
    placeholder: '+31612345678',
  });

export const DEFAULT_OPEN = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.OpenQ,
    description: ['New Open Question'],
    placeholder: 'Enter a response',
  });

export const DEFAULT_EMAIL = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.EmailQ,
    description: ['New Email Question'],
    placeholder: 'johnsmith@email.com',
  });

export const DEFAULT_TEXT = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.TextQ,
    description: ['New Comment'],
    text: 'Comment body',
  });

export const DEFAULT_ADDRESS = (): Settings =>
  Object.assign({}, DEFAULT_GENERIC(), {
    type: QuestionType.AddressQ,
    description: ['New Address Question (Dutch)'],
    placeholder: 'Street',
  });
