import { isGenericUpdate, Update, UpdateType } from './update';

export interface StartEnabledChange extends Update {
  type: UpdateType.StartEnabledChange;
  enabled: boolean;
}
export interface TitleChange extends Update {
  type: UpdateType.StartTitleChange;
  title: string;
}

export interface BodyChange extends Update {
  type: UpdateType.StartBodyChange;
  body: string;
}

export interface ImageEnabledChange extends Update {
  type: UpdateType.StartImageEnabledChange;
  imageEnabled: boolean;
}

export interface ImageChange extends Update {
  type: UpdateType.StartImageChange;
  image: {
    hash: string;
    name: string;
    scale?: number;
  };
}

export const isTitleChange = isGenericUpdate<TitleChange>(UpdateType.StartTitleChange);
export const isBodyChange = isGenericUpdate<BodyChange>(UpdateType.StartBodyChange);
export const isStartEnabledChange = isGenericUpdate<StartEnabledChange>(UpdateType.StartEnabledChange);
export const isStartImageEnabledChange = isGenericUpdate<ImageEnabledChange>(UpdateType.StartImageEnabledChange);
export const isStartImageChange = isGenericUpdate<ImageChange>(UpdateType.StartImageChange);
