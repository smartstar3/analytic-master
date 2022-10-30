import { EventEmitter, Injectable, Optional } from '@angular/core';
import { PublishedStartService } from './published-start.service';
import { StartService as BuilderStartService } from '../../builder2/services/start.service';
import { Update } from '../../builder2/services/update/update';
import { StartScreen } from '../../question';

@Injectable()
export class StartService {
  constructor(@Optional() private bss: BuilderStartService, @Optional() private pss: PublishedStartService) {
    if (!bss && !pss) throw new Error('Neither BuilderStartService or PublishedStartService are provided.');
  }

  get change(): EventEmitter<Update> {
    return this.bss?.change;
  }

  get start(): StartScreen {
    return this.bss.start || this.pss.start;
  }
}
