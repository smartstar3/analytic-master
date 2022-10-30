import { Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import { EndService } from './end.service';
import { Observable } from 'rxjs';

@Injectable()
export class PosService {
  get: { [id: string]: number } = {};
  private oldOrders: string[][] = [];

  constructor(private qs: QuestionService, private es: EndService) {
    this.subscribe(qs.order);
    this.subscribe(es.order, (pos: number) => -(pos + 1));
  }

  exists(id: string): boolean {
    return this.get[id] !== undefined;
  }

  private subscribe(orderObs: Observable<string[]>, transform: PosTransformer = (pos: number) => pos): void {
    const index = this.oldOrders.length;
    this.oldOrders.push([]);
    orderObs.subscribe((order: string[]) => {
      this.oldOrders[index].forEach((id: string) => delete this.get[id]);
      order.forEach((id: string, i: number) => (this.get[id] = transform(i)));
      this.oldOrders[index] = [...order];
    });
  }
}

type PosTransformer = (pos: number) => number;
