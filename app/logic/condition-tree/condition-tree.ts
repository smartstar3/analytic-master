import { Condition } from '../logic';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TreeControl } from '@angular/cdk/tree';
import { ErrorService } from '../../builder2/services/error-system/error.service';

export class ConditionTree {
  public condition: BehaviorSubject<Condition> = new BehaviorSubject<Condition>(null);
  public structure: BehaviorSubject<ConditionNode> = new BehaviorSubject<ConditionNode>(null);
  private conditionSub: Subscription;

  private constructor(
    private root: ConditionNode,
    private control: TreeControl<ConditionNode>,
    private path: string,
    private err?: ErrorService
  ) {
    this.setRoot(this.root);
    this.structure.next(this.root);
    this.control.expand(this.root);
  }

  static from(
    condition: Condition,
    control: TreeControl<ConditionNode>,
    path: string,
    err?: ErrorService
  ): ConditionTree {
    return new ConditionTree(ConditionNode.from(path, condition), control, path, err);
  }

  rebuild(condition: Condition): void {
    this.setRoot(ConditionNode.from(this.path, condition));
    this.structure.next(this.root);
    this.control.expand(this.root);
  }

  setRoot(node: ConditionNode): void {
    if (!this.root || this.control.isExpanded(this.root)) {
      this.control.expand(node);
    } else {
      this.control.collapse(node);
    }
    this.root = node;
    this.conditionSub?.unsubscribe();
    this.conditionSub = this.root.data.subscribe({
      next: (data: Condition) => this.condition.next(data),
      complete: () => this.destroy(),
    });
  }

  split(node: ConditionNode, type: 'and' | 'or' = 'or'): ConditionNode {
    const old = this.err?.get(node.path);
    let newParent = node.split(type);
    const newNode = this.err?.get(node.path);
    if (this.err) {
      newNode.show = true;
      newNode.value = old.value;
      old.delete();
    }
    this.control.expand(newParent);
    if (newParent.isRoot) this.setRoot(newParent);
    this.changeStructure();
    if (newParent.isRoot) newParent = this.root;
    return newParent;
  }

  addChild(node: ConditionNode, type: 'and' | 'or' | 'check', splitType?: 'and' | 'or'): ConditionNode {
    let newChild;
    if (node.type === 'check') {
      newChild = this.addChild(this.split(node, splitType), type);
    } else {
      newChild = node.addChild(type);
    }
    this.changeStructure();
    this.control.expandDescendants(newChild);
    return newChild;
  }

  delete(node: ConditionNode): void {
    node.delete();
    if (this.root) this.changeStructure();
  }

  destroy(): void {
    this.root = null;
    this.conditionSub?.unsubscribe();
    this.condition.complete();
    this.structure.complete();
  }

  changeStructure(): void {
    const clone = ConditionNode.clone(this.root); // cloned to trigger change detection
    if (this.control.isExpanded(this.root)) {
      this.control.expand(clone);
    } else {
      this.control.collapse(clone);
    }
    this.root = clone;
    this.structure.next(this.root);
  }
}

export class ConditionNode {
  protected constructor(key: string, public type: 'or' | 'and' | 'check' = 'check') {
    this.key = key;
  }
  get path(): string {
    return this._path;
  }
  set key(key: string) {
    this._key = key;
    this.updatePath();
  }

  get isRoot(): boolean {
    return !this.parent;
  }

  get condition(): Condition {
    return this.data.value;
  }

  set condition(condition: Condition) {
    this.data.next(condition);
  }

  private get children(): ConditionNode[] {
    return Array.from(this._children.values());
  }

  private set children(children: ConditionNode[]) {
    this._children = new Map<number, ConditionNode>(
      children.map((child) => {
        child.parent = this;
        return [child.id, child];
      })
    );
  }
  protected get parent(): ConditionNode {
    return this._parent;
  }
  protected set parent(parent: ConditionNode) {
    this._parent = parent;
    this.updatePath();
    for (const child of this.children) {
      child.parent = this;
    }
  }
  private static currentId = 0;

  private _path: string;
  private _key: string;
  data: BehaviorSubject<Condition> = new BehaviorSubject<Condition>(null);
  private _parent: ConditionNode = null;
  private id: number = ConditionNode.currentId++;

  private _children: Map<number, ConditionNode> = new Map<number, ConditionNode>();

  static from(key: string, condition: Condition = { check: null }): ConditionNode {
    condition = condition ? condition : { check: null };
    let node: ConditionNode;
    if ('and' in condition) {
      node = new ConditionNode(key, 'and');
      node.children = condition.and.map((con: Condition, i: number) => ConditionNode.from(String(i), con));
    } else if ('or' in condition) {
      node = new ConditionNode(key, 'or');
      node.children = condition.or.map((con: Condition, i: number) => ConditionNode.from(String(i), con));
    } else {
      node = new ConditionLeaf(key, condition);
    }
    return node;
  }

  private static swapIds(node1: ConditionNode, node2: ConditionNode): void {
    const tempId = node1.id;
    node1.id = node2.id;
    node2.id = tempId;
  }

  static clone(node: ConditionNode): ConditionNode {
    const clone = new ConditionNode(node._key, node.type);
    ConditionNode.currentId--;
    clone.id = node.id;
    clone._path = node._path;
    clone.children = node.children;
    node.parent?.setChild(clone);
    clone.data = node.data;
    return clone;
  }

  private updatePath(): void {
    const parentPath = this.parent?.path ? this.parent.path + '.' : '';
    this._path = parentPath + this._key + '.' + this.type;
  }

  setType(type: 'and' | 'or'): void {
    this.type = type;
    this.updatePath();
    for (const child of this.children) {
      child.parent = this;
    }
    this.refresh();
  }

  getChildren(): ConditionNode[] {
    return this.children;
  }

  refresh(): void {
    switch (this.type) {
      case 'and':
        this.data.next({
          and: this.children.map((child: ConditionNode) => child.condition),
        });
        break;
      case 'or':
        this.data.next({
          or: this.children.map((child: ConditionNode) => child.condition),
        });
        break;
      case 'check':
        throw new Error(`Unexpected type: 'check' in non-leaf ConditionNode`);
    }
    this.parent?.refresh();
  }

  split(type: 'and' | 'or'): ConditionNode {
    const newParent = new ConditionNode(this._key, type);
    ConditionNode.swapIds(this, newParent); // swap to maintain order
    // insert new parent between self and old parent
    this.parent?.setChild(newParent);
    newParent.setChild(this);
    newParent.refresh(); // build up the new parent's data
    return newParent;
  }

  addChild(type: 'and' | 'or' | 'check'): ConditionNode {
    let newChild;
    if (type === 'check') {
      newChild = new ConditionLeaf(String(this.children.length));
    } else {
      newChild = new ConditionNode(String(this.children.length), type);
      newChild.addChild('check');
    }
    this.setChild(newChild);
    this.refresh();
    return newChild;
  }

  delete(): void {
    // detach self from tree
    this.parent?._children.delete(this.id);

    if (this.parent?.children.length === 0) {
      this.parent?.delete();
    } else {
      this.parent?.refresh();
    }
    this.parent = null;
    this.data.complete();
  }

  private setChild(node: ConditionNode): void {
    let i = this.children.findIndex((n: ConditionNode) => node.id == n.id);
    i = i >= 0 ? i : this.children.length;
    node._key = String(i);
    this._children.set(node.id, node);
    node.parent = this;
  }
}

class ConditionLeaf extends ConditionNode {
  type: 'check' = 'check';

  constructor(key: string, condition: Condition = { check: null }) {
    super(key);
    this.data.next(condition);
  }

  get condition(): Condition {
    return this.data.value;
  }

  set condition(condition: Condition) {
    this.data.next(condition);
    this.parent?.refresh();
  }

  refresh(): void {
    this.data.next(this.condition);
    this.parent?.refresh();
  }

  setType(type: 'and' | 'or'): void {
    throw new Error('cannot change ConditionLeaf type');
  }
}
