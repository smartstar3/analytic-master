import { Component } from '@angular/core';
import { Condition } from '../../../../logic/logic';
import { QuestionService } from '../../../services/question.service';
import { EndService } from '../../../services/end.service';
import { PosService } from '../../../services/pos.service';
import { JumpAdd, JumpChange, JumpRemove } from '../../../services/update/question-update';
import { UpdateType } from '../../../services/update/update';
import { Jump } from '../../../../logic/jump';
import { SelectionService } from '../../../services/selection.service';
import { DescriptionService } from '../../../services/description.service';
import { ErrorService } from '../../../services/error-system/error.service';

@Component({
  selector: 'app-logic',
  templateUrl: './logic.component.html',
  styleUrls: ['./logic.component.scss'],
})
export class LogicComponent {
  get path(): string {
    return `questions.${this.sel.id}.jumps`;
  }
  constructor(
    public qs: QuestionService,
    public es: EndService,
    public pos: PosService,
    public sel: SelectionService,
    public ds: DescriptionService,
    public err: ErrorService
  ) {}

  addJump(i?: number): void {
    const index = this.pos.get[this.sel.id];
    const then = index === this.qs.order.value.length - 1 ? 'null' : this.qs.order.value[index + 1];

    if (typeof i === 'number') {
      this.qs.get[this.sel.id].conf.jumps.splice(i + 1, 0, { condition: { check: null }, then });
      this.qs.update<JumpAdd>({ jump: i + 1, type: UpdateType.JumpAdd }, this.sel.id);
    } else {
      this.qs.get[this.sel.id].conf.jumps.push({ condition: { check: null }, then });
      this.qs.update<JumpAdd>({ jump: 0, type: UpdateType.JumpAdd }, this.sel.id);
    }
  }

  removeJump(i: number): void {
    this.qs.get[this.sel.id].conf.jumps.splice(i, 1);
    this.err.get(this.path + `.${i}`).delete();
    this.qs.update<JumpRemove>({ jump: i, type: UpdateType.JumpRemove }, this.sel.id);
  }

  conditionChange(condition: Condition, i: number): void {
    if (!condition) return;
    this.qs.get[this.sel.id].conf.jumps[i].condition = condition;
    if (condition) {
      this.qs.update<JumpChange>({ jump: i, change: 'condition', type: UpdateType.JumpChange }, this.sel.id);
    }
  }

  thenChange(then: Jump, i: number): void {
    this.qs.get[this.sel.id].conf.jumps[i].then = then;
    this.qs.update<JumpChange>({ jump: i, change: 'then', type: UpdateType.JumpChange }, this.sel.id);
  }
}
