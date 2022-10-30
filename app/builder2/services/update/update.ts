export enum UpdateType {
  // QuestionService
  QuestionAdd,
  QuestionDelete,
  QuestionMove,
  DescriptionChange,
  TypeChange,
  MaxChange,
  MinChange,
  ChoiceDelete,
  ChoiceAdd,
  RatingTypeChange,
  PlaceholderChange,
  TextChange,
  JumpChange,
  JumpAdd,
  JumpRemove,

  // EndService
  EndAdd,
  EndDelete,
  EndMove,
  EndTitleChange,
  EndBodyChange,
  EndLinkChange,
  EndLinkEnabledChange,
  EndEnabledChange,
  DefaultEndChange,
  EndImageEnabledChange,
  EndImageChange,
  EndMailEnableChange,
  EndMailChange,

  // StartService
  StartEnabledChange,
  StartTitleChange,
  StartBodyChange,
  StartImageEnabledChange,
  StartImageChange,

  // NameService
  NameChange,
}

export interface Update {
  type: UpdateType;
}

export function isGenericUpdate<T extends Update>(type: UpdateType): (update: Update) => update is T {
  return ((update: Update) => {
    return update.type === type;
  }) as (update: Update) => update is T;
}
