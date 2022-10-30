import { isGenericUpdate, Update, UpdateType } from './update';

export interface TitleChange extends Update {
  type: UpdateType.EndTitleChange;
  title: string;
}

export interface BodyChange extends Update {
  type: UpdateType.EndBodyChange;
  body: string;
}

export interface LinkChange extends Update {
  type: UpdateType.EndLinkChange;
  link: {
    button: string;
    url: string;
  };
}

export interface LinkEnabledChange extends Update {
  type: UpdateType.EndLinkEnabledChange;
  enabled: boolean;
}

export interface EndAdd extends Update {
  type: UpdateType.EndAdd;
  id: string;
  pos?: number;
}

export interface EndDelete extends Update {
  type: UpdateType.EndDelete;
  pos: number;
  id: string;
}

export interface EndMove extends Update {
  type: UpdateType.EndMove;
  from: number;
  to: number;
}

export interface DefaultEndChange extends Update {
  type: UpdateType.DefaultEndChange;
  default: string;
}

export interface EndEnabledChange extends Update {
  type: UpdateType.EndEnabledChange;
  enabled: boolean;
}

export interface EndImageEnabledChange extends Update {
  type: UpdateType.EndImageEnabledChange;
  enabled: boolean;
}

export interface EndImageChange {
  type: UpdateType.EndImageChange;
  image: {
    hash: string;
    name: string;
    scale?: number;
  };
}

export interface EndMailChange extends Update {
  type: UpdateType.EndMailChange;
  mail: {
    subject: string;
    message: string;
    sendTo: string[];
    linkUrl: string;
  };
}

export interface EndMailEnabledChange extends Update {
  type: UpdateType.EndMailEnableChange;
  enabled: boolean;
}

export const isTitleChange = isGenericUpdate<TitleChange>(UpdateType.EndTitleChange);
export const isBodyChange = isGenericUpdate<BodyChange>(UpdateType.EndBodyChange);
export const isLinkChange = isGenericUpdate<LinkChange>(UpdateType.EndLinkChange);
export const isLinkEnabledChange = isGenericUpdate<LinkEnabledChange>(UpdateType.EndLinkEnabledChange);
export const isEndAdd = isGenericUpdate<EndAdd>(UpdateType.EndAdd);
export const isEndDelete = isGenericUpdate<EndDelete>(UpdateType.EndDelete);
export const isEndMove = isGenericUpdate<EndMove>(UpdateType.EndMove);
export const isDefaultEndChange = isGenericUpdate<DefaultEndChange>(UpdateType.DefaultEndChange);
export const isEndEnabledChange = isGenericUpdate<EndEnabledChange>(UpdateType.EndEnabledChange);
export const isEndImageChange = isGenericUpdate<EndImageChange>(UpdateType.EndImageChange);
export const isEndImageEnabledChange = isGenericUpdate<EndImageEnabledChange>(UpdateType.EndImageEnabledChange);
export const isEndMailChange = isGenericUpdate<EndMailChange>(UpdateType.EndMailChange);
export const isEndMailEnabledChange = isGenericUpdate<EndMailEnabledChange>(UpdateType.EndMailEnableChange);
