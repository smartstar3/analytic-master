import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Answers, DBAnswers } from '../../question';
import { Env } from '../../logic/logic';
import { PublishedQuestionService } from '../../form/services/published-question.service';
import { PublishedEndService } from '../../form/services/published-end.service';
import { InitService } from '../../form/services/init.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnChanges {
  @Input() submission: DBAnswers;
  submissionEnv: Env<number>;

  constructor(public qs: PublishedQuestionService, public es: PublishedEndService, public is: InitService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.submission && this.submission) {
      this.submissionEnv = this.environmentalize(this.submission);
    }
  }

  environmentalize(submission: DBAnswers): Env<number> {
    const env = new Answers(this.qs);
    for (const answer of submission.answers) {
      env.edit(answer.question, answer.type, answer.answer, true);
    }
    return env;
  }
}
