import { Injectable, OnDestroy } from '@angular/core';
import { ErrorState, Node } from '../../builder2/services/error-system/tree-map';
import { valid } from '../../builder2/services/error-system/error.service';

@Injectable()
export class FilterErrorService implements OnDestroy {
  private _tree: Node<ErrorState> = new Node<ErrorState>();
  get tree(): Node<ErrorState> {
    return this._tree;
  }

  get(path: string, p: boolean = true): Node<ErrorState> {
    return this.tree.get(path, p);
  }

  set(path: string, err: ErrorState, p: boolean = true): void {
    this.tree.set(path, err, p);
  }

  ngOnDestroy(): void {
    this.tree?.delete();
  }

  valid(): boolean {
    return valid(this.tree);
  }
}
