import { Q } from './questions';
import { v1 as uuidv1 } from 'uuid';

export interface Form {
  name: string;
  questions: Q[];
  start?: StartScreen;
  ends?: EndScreen[];
  defaultEnd?: number;
  design?: Design;
  link?: string;
}

// i'll just ignore this and rewrite later
export function formFromJSON(obj): Form {
  for (const key in obj.questions) {
    if (!obj.questions.hasOwnProperty(key)) continue;
    obj.questions[key] = Q.fromJSON(obj.questions[key]);
  }
  return Object.assign({}, obj);
}

export interface StartScreen {
  title: string;
  body: string;
  imageEnabled?: boolean;
  image?: {
    hash: string;
    name: string;
    scale?: number;
  };
}

export interface EndScreen {
  title: string;
  body: string;
  link?: {
    button: string;
    url: string;
  };
  linkEnabled?: boolean;
  imageEnabled?: boolean;
  image?: {
    hash: string;
    name: string;
    scale?: number;
  };
  mailEnabled?: boolean;
  mail?: {
    subject: string;
    message: string;
    sendTo: string[];
    linkUrl: string;
  }
}

export type UniqueEndScreen = Unique & EndScreen;
export type UniqueQ = Unique & Q;

export class Unique {
  public id: string;
  constructor() {
    this.id = uuidv1();
  }
}

export function unique<T>(t: T): T & Unique {
  const result: Partial<T & Unique> = {};
  for (const prop in t) {
    if (Object.prototype.hasOwnProperty.call(t, prop)) {
      (result as T)[prop] = t[prop];
    }
  }
  const id: Unique = new Unique();

  for (const prop in id) {
    if (Object.prototype.hasOwnProperty.call(id, prop)) {
      (result as Unique)[prop] = id[prop];
    }
  }
  return result as T & Unique;
}

export interface ConstructionForm {
  name: string;
  questions: { [id: string]: UniqueQ };
  questionList: string[];
  start?: StartScreen;
  ends?: { [id: string]: UniqueEndScreen };
  endList?: string[];
  defaultEnd?: string;
  design?: Design;
}

export interface Design {
  name: string;
  font: string;
  question: string;
  answer: string;
  button: string;
  card: string;
  background: string;
  backgroundImage?: File;
}
