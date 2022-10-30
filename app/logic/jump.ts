import { Check, Condition } from './logic';

export type Jump = string | number | 'null';

export interface If {
  condition: Condition;
  then: Jump;
}

export function conditionLeafTraverser(con: Condition, callback: (check: Check) => void): void {
  if ('and' in con) {
    con.and.forEach((subCon: Condition) => conditionLeafTraverser(subCon, callback));
  } else if ('or' in con) {
    con.or.forEach((subCon: Condition) => conditionLeafTraverser(subCon, callback));
  } else if ('check' in con) {
    callback(con);
  } else {
    throw new Error('');
  }
}
