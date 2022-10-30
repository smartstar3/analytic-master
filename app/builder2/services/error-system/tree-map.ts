import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TreeSave } from '../init.service';

/* eslint-disable @typescript-eslint/ban-types */
export class Node<V extends object> {
  get deleted(): boolean {
    return this._deleted;
  }
  get value(): V {
    return this._value.value;
  }
  set value(value: V) {
    if (this.deleted) return;
    this._value.next(value);
    this.rebuildFlat();
  }
  get valueChange(): BehaviorSubject<V> {
    return this._value;
  }
  get flat(): Flatten<V> {
    return this._flat.value;
  }
  set flat(flat: Flatten<V>) {
    this._flat.next(flat);
  }
  get flatChange(): BehaviorSubject<Flatten<V>> {
    return this._flat;
  }

  private _show: boolean;
  get show(): boolean {
    return this._show;
  }
  set show(showError: boolean) {
    if (this._show === showError) return;
    this._show = showError;
    this.rebuildFlat();
  }

  constructor(parent?: Node<V>, key?: string) {
    if (!parent || !key) return;
    this.key = key;
    this.parent = parent;
    this.flatChange.pipe(filter((flat: Flatten<V>) => !!flat)).subscribe({
      next: () => parent.rebuildFlat(),
      complete: () => parent.rebuildFlat(),
    });
  }
  key: string;
  private parent: Node<V>;
  children: { [key: string]: Node<V> } = {};
  private _deleted = false;

  private _value: BehaviorSubject<V> = new BehaviorSubject<V>(null);

  private _flat: BehaviorSubject<Flatten<V>> = new BehaviorSubject<Flatten<V>>(null);

  static from<V extends object>(obj: object, root: Node<V> = new Node()): Node<V> {
    if (typeof obj !== 'object' || obj.constructor.toString().indexOf('Array') !== -1) {
      throw new Error('Object expected');
    }
    Node._from<V>(obj, root);
    return root;
  }
  private static _from<V extends object>(obj: object, root: Node<V>): void {
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      root.children[key] = new Node<V>(root, key);

      // recurse if object and not array
      if (
        obj[key] &&
        typeof obj[key] === 'object' &&
        (obj[key] as object).constructor.toString().indexOf('Array') === -1
      ) {
        Node._from(obj[key], root.children[key]);
      }
    }
  }
  static fromTree<V extends object>(tree: TreeSave<V>, root: Node<V>): Node<V> {
    if (tree.value) root.value = tree.value;
    Node._fromTree<V>(tree.children, root);
    return root;
  }

  private static _fromTree<V extends object>(children: { [key: string]: TreeSave<V> }, root: Node<V>): void {
    for (const key in children) {
      if (!Object.prototype.hasOwnProperty.call(children, key)) continue;
      const child = children[key];
      const node = new Node(root, key);
      root.children[key] = node;
      if (child.value) {
        node.value = child.value;
        node.show = node.value ? true : node.show;
      }
      Node._fromTree(child.children, node);
    }
  }

  save(): TreeSave<V> {
    const children: { [key: string]: TreeSave<V> } = {};
    for (const key in this.children) {
      if (!Object.prototype.hasOwnProperty.call(this.children, key)) continue;
      children[key] = this.children[key].save();
    }
    return { children, key: this.key, value: this.value };
  }

  set(key: string = '', value: V, p: boolean = false): Node<V> {
    return this._set(key.split('.'), value, p);
  }
  private _set(keys: string[], value: V, p): Node<V> {
    const path = getRoute(this, keys, p);
    const node = exists(path, keys);
    if (node) node.value = value;
    return node;
  }

  get(key: string, p: boolean = false): Node<V> {
    if (!key) return this;
    return this._get(key.split('.'), p);
  }
  private _get(keys: string[], p: boolean = false): Node<V> {
    const path = getRoute(this, keys, p);
    return exists(path, keys);
  }

  private rebuildFlat(): void {
    if (this.deleted) return;
    const flat: Flatten<V> = {} as Flatten<V>;
    for (const key in this.children) {
      if (!Object.prototype.hasOwnProperty.call(this.children, key)) continue;
      const child = this.children[key];
      for (const attr in child.flat) {
        if (!Object.prototype.hasOwnProperty.call(child.flat, attr)) continue;
        if (!flat[attr]) flat[attr] = [];
        flat[attr].push(...child.flat[attr]);
      }
    }
    for (const attr in this.value) {
      if (!Object.prototype.hasOwnProperty.call(this.value, attr)) continue;
      if (!flat[attr]) flat[attr] = [];
      if (this.value[attr] && this.show) {
        flat[attr].push(this.value[attr]);
      }
    }
    this.flat = flat;
  }

  cleanup(): void {
    this.valueChange.complete();
    this.flatChange.complete();
  }

  delete(): void {
    this._deleted = true;
    delete this.parent?.children[this.key];
    this.cleanup();
    for (const key in this.children) {
      if (!Object.prototype.hasOwnProperty.call(this.children, key)) continue;
      this.children[key].delete();
    }
  }

  showErrors(): void {
    this.show = this.value ? true : this.show;
    for (const key in this.children) {
      if (!Object.prototype.hasOwnProperty.call(this.children, key)) continue;
      this.children[key].showErrors();
    }
  }
}

function getRoute<V extends object>(cur: Node<V>, keys: string[], p: boolean = false): Node<V>[] {
  const path: Node<V>[] = [cur];
  for (const key of keys) {
    let next = cur.children[key];
    if (!next) {
      if (!p) return path;
      cur.children[key] = new Node<V>(cur, key);
      next = cur.children[key];
    }
    path.push(next);
    cur = next;
  }
  return path;
}

function exists<V extends object>(path: Node<V>[], keys: string[]): Node<V> {
  // if the path is the length of the keys (+ root) the entire key-path has been traversed, node was found
  if (path.length === keys.length + 1) return path[path.length - 1];
  return null; // not fully traversed, stopped short of finding the node
}

export interface ErrorState {
  error?: string;
  warning?: string;
}
export type FlatErrorState = Flatten<ErrorState>;

type Flatten<T> = { [P in keyof T]-?: T[P][] };
