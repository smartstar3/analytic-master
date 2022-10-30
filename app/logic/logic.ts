export type Primitive = number | string | boolean | number[] | string[] | boolean[] | StringMap;

export interface Env<K> {
  get(i: K): Primitive;
  getString(i: K): string;
}

export class BasicEnv implements Env<number> {
  [i: number]: Primitive;
  get(i: number): Primitive {
    return this[i];
  }
  getString(i: number): string {
    return `${this[i]}`;
  }
}

export enum Op {
  Eq = 'eq',
  Lt = 'lt',
  Lte = 'lte',
  Gt = 'gt',
  Gte = 'gte',
  InclAll = 'incl_all',
  InclSome = 'incl_some',
}

export interface And {
  and: Condition[];
}

export interface Or {
  or: Condition[];
}

export interface Check {
  check: Comparison;
}

export interface Comparison {
  op: Op;
  negate?: boolean;
  q: number | string;
  val: Primitive;
}

export type Condition = And | Or | Check;

export function interpComparison(com: Comparison, env: Env<string | number>): boolean {
  let res: boolean;
  switch (com.op) {
    case Op.Eq:
      res = env.get(com.q) === com.val;
      break;
    case Op.Lt:
      res = env.get(com.q) < com.val;
      break;
    case Op.Lte:
      res = env.get(com.q) <= com.val;
      break;
    case Op.Gt:
      res = env.get(com.q) > com.val;
      break;
    case Op.Gte:
      res = env.get(com.q) >= com.val;
      break;
    case Op.InclAll:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res = (com.val as any[]).every((val: any) => (env.get(com.q) as any[]).includes(val));
      break;
    case Op.InclSome:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res = (com.val as any[]).some((val: any) => (env.get(com.q) as any[]).includes(val));
      break;
    default:
      throw new Error(`Unexpected operation '${com.op}' in comparison`);
  }
  return !res !== !com.negate;
}

export function interpCondition(con: Condition, env: Env<string | number>): boolean {
  if ('and' in con) {
    return con.and.every((con: Condition) => interpCondition(con, env));
  } else if ('or' in con) {
    return con.or.some((con: Condition) => interpCondition(con, env));
  } else if ('check' in con) {
    return interpComparison(con.check, env);
  } else {
    throw new Error('');
  }
}

export interface StringMap {
  [field: string]: string;
}
