import { Update, UpdateType } from './update';

export interface NameChange extends Update {
  type: UpdateType.NameChange;
  name: string;
}
