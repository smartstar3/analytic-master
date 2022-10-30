import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Form } from 'src/app/question';
import { DBAnswers } from 'src/app/question/answer';
import { ApiService } from 'src/app/api/api.service';
import { tap } from 'rxjs/operators';
import { MessengerService } from 'src/app/messenger/messenger.service';
import { DEFAULT_DESIGN } from '../../builder2/services/save.service';
import { PublishedStartService } from '../../form/services/published-start.service';
import { PublishedQuestionService } from '../../form/services/published-question.service';
import { PublishedEndService } from '../../form/services/published-end.service';
import { IdService } from '../../form/services/id.service';
import { InitService } from '../../form/services/init.service';
import { StartService } from '../../form/services/start.service';
import { QuestionService } from '../../form/services/question.service';
import { EndService } from '../../form/services/end.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [
    IdService,
    InitService,
    StartService,
    PublishedStartService,
    QuestionService,
    PublishedQuestionService,
    EndService,
    PublishedEndService,
  ],
})
export class RootComponent implements OnInit {
  id: string;
  company: string;
  token: string;
  form: Form;
  loaded = false;
  background: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private msgr: MessengerService
  ) {}

  ngOnInit(): void {
    this.getId();
    this.getForm();
  }

  getId(): void {
    this.company = this.route.snapshot.paramMap.get('company');
    this.id = this.route.snapshot.paramMap.get('id');

    // Get token param
    this.route.queryParams.subscribe((params) => {
      const map = convertToParamMap(params);
      this.token = map.get('token');
    });
  }

  getForm(): void {
    this.api
      .getForm(this.company, this.id)
      .pipe(tap(() => (this.loaded = true)))
      .subscribe(
        (form) => {
          if (form.design) {
            this.background = form.design.background;
          } else {
            form.design = DEFAULT_DESIGN;
          }
          this.form = form;
        },
        (err) => {
          console.error(err);
          void this.router.navigate(['/']);
        }
      );
  }

  submit(answers: DBAnswers): void {
    this.api
      .postAnswer(this.company, this.id, this.token, answers)
      .toPromise()
      .catch((err) => this.msgr.httpErrorHandler(err, 'Failed to submit answers'));
  }
}
