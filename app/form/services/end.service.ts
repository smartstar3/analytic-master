import { EventEmitter, Injectable, Optional } from '@angular/core';
import { Update } from '../../builder2/services/update/update';
import { EndService as BuilderEndService } from '../../builder2/services/end.service';
import { EndScreen } from '../../question';
import { PublishedEndService } from './published-end.service';

@Injectable()
export class EndService {
  constructor(@Optional() private bes: BuilderEndService, @Optional() private pes: PublishedEndService) {
    if (!bes && !pes) throw new Error('Neither BuilderEndService or PublishedEndService are provided.');
  }

  get(id: string | number): EndScreen {
    if (typeof id === 'string') return this.bes?.get[id] as EndScreen;
    if (typeof id === 'number') return this.pes?.get[id];
  }

  getChange(id: string): EventEmitter<Update> {
    if (typeof id === 'string') return this.bes?.getChange[id];
    throw new Error(`Unexpected eid type: ${typeof id}. Only builder ends have change emitters`);
  }
}
