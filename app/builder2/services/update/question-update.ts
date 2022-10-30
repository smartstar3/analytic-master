import { BuilderDescription, QuestionType } from '../../../question';
import { isGenericUpdate, Update, UpdateType } from './update';

export interface DescriptionChange extends Update {
  type: UpdateType.DescriptionChange;
  description: BuilderDescription;
}
export interface TypeChange extends Update {
  type: UpdateType.TypeChange;
  to: QuestionType;
}

export interface MaxChange extends Update {
  type: UpdateType.MaxChange;
  max: number;
}

export interface MinChange extends Update {
  type: UpdateType.MinChange;
  min: number;
}

export interface ChoiceDelete extends Update {
  type: UpdateType.ChoiceDelete;
  pos: number;
}

export interface ChoiceAdd extends Update {
  type: UpdateType.ChoiceAdd;
  choice: string;
  pos?: number;
}

export interface RatingTypeChange extends Update {
  type: UpdateType.RatingTypeChange;
  ratingType: string;
}

export interface PlaceholderChange extends Update {
  type: UpdateType.PlaceholderChange;
  placeholder: string;
}

export interface TextChange extends Update {
  type: UpdateType.TextChange;
  text: string;
}

export interface JumpChange extends Update {
  type: UpdateType.JumpChange;
  jump: number;
  change: 'condition' | 'then';
}

export interface JumpAdd extends Update {
  type: UpdateType.JumpAdd;
  jump: number;
}

export interface JumpRemove extends Update {
  type: UpdateType.JumpRemove;
  jump: number;
}

export interface QuestionAdd extends Update {
  type: UpdateType.QuestionAdd;
  id: string;
  pos?: number;
}

export interface QuestionDelete extends Update {
  type: UpdateType.QuestionDelete;
  pos: number;
  id: string;
}

export interface QuestionMove extends Update {
  type: UpdateType.QuestionMove;
  from: number;
  to: number;
}

export const isDescriptionChange = isGenericUpdate<DescriptionChange>(UpdateType.DescriptionChange);
export const isTypeChange = isGenericUpdate<TypeChange>(UpdateType.TypeChange);
export const isMaxChange = isGenericUpdate<MaxChange>(UpdateType.MaxChange);
export const isMinChange = isGenericUpdate<MinChange>(UpdateType.MinChange);
export const isChoiceDelete = isGenericUpdate<ChoiceDelete>(UpdateType.ChoiceDelete);
export const isChoiceAdd = isGenericUpdate<ChoiceAdd>(UpdateType.ChoiceAdd);
export const isRatingTypeChange = isGenericUpdate<RatingTypeChange>(UpdateType.RatingTypeChange);
export const isPlaceholderChange = isGenericUpdate<PlaceholderChange>(UpdateType.PlaceholderChange);
export const isTextChange = isGenericUpdate<TextChange>(UpdateType.TextChange);
export const isJumpChange = isGenericUpdate<JumpChange>(UpdateType.JumpChange);
export const isJumpAdd = isGenericUpdate<JumpAdd>(UpdateType.JumpAdd);
export const isJumpRemove = isGenericUpdate<JumpRemove>(UpdateType.JumpRemove);
export const isQuestionAdd = isGenericUpdate<QuestionAdd>(UpdateType.QuestionAdd);
export const isQuestionDelete = isGenericUpdate<QuestionDelete>(UpdateType.QuestionDelete);
export const isQuestionMove = isGenericUpdate<QuestionMove>(UpdateType.QuestionMove);
