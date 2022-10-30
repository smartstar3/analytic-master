import { Component, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ConditionNode, ConditionTree } from './condition-tree';
import { Condition } from '../logic';
import { BehaviorSubject } from 'rxjs';
import { ErrorService } from '../../builder2/services/error-system/error.service';

@Component({
  selector: 'logic-condition-tree',
  templateUrl: './condition-tree.component.html',
  styleUrls: ['./condition-tree.component.scss'],
})
export class ConditionTreeComponent implements OnInit, OnDestroy {
  treeControl: NestedTreeControl<ConditionNode>;
  dataSource: MatTreeNestedDataSource<ConditionNode>;

  tree: ConditionTree;

  @Input() condition: Condition;
  @Input() path = '';
  @Output() conditionChange: BehaviorSubject<Condition> = new BehaviorSubject<Condition>(null);

  constructor(@Optional() public err: ErrorService) {
    this.treeControl = new NestedTreeControl<ConditionNode>((node) => node.getChildren());
    this.dataSource = new MatTreeNestedDataSource<ConditionNode>();
    this.dataSource.data = [];
  }

  ngOnInit(): void {
    this.tree = ConditionTree.from(this.condition, this.treeControl, this.path, this.err);

    // update the tree whenever the structure changes
    this.tree.structure.subscribe({
      next: (root: ConditionNode) => {
        this.dataSource.data = [root];
      },
      complete: () => {
        this.dataSource.data = [];
      },
    });
    this.tree.condition.subscribe({
      next: (condition: Condition) => this.conditionChange.next(condition),
      complete: () => this.conditionChange.complete(),
    });
  }

  rebuild(condition: Condition): void {
    this.tree.rebuild(condition);
  }

  hasChild = (_: number, node: ConditionNode) => node.getChildren().length > 0;

  ngOnDestroy(): void {
    this.tree?.destroy();
  }
}
