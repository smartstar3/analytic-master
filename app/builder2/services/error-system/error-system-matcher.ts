import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorState, Node } from './tree-map';

export class ErrorSystemMatcher implements ErrorStateMatcher {
  constructor(public node: Node<ErrorState>) {}

  isErrorState(): boolean {
    return this.node?.show && this.node?.value?.error !== undefined;
  }
}
