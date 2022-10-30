import { Component, Inject, OnInit } from '@angular/core';
import { ApiService, FormId, FormState } from 'src/app/api/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { MessengerService } from 'src/app/messenger/messenger.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BuilderDescription, Description, EndScreen, Form, Q, unique } from '../../question';
import { ConstructionForm } from '../../question';
import { conditionLeafTraverser, If } from '../../logic/jump';
import { Check } from '../../logic/logic';
import { ConstructionSave } from '../../builder2/services/init.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
})
export class FormListComponent implements OnInit {
  queryParams: Params;
  states: FormState[] = [];
  showState: boolean;
  forms: FormId[] = [];
  companyLink: string;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public dialog: MatDialog,
    private msgr: MessengerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.queryParams = this.route.snapshot.queryParams;
    this.states = this.route.snapshot.data.states as FormState[];
    this.states = this.states ? this.states : [];
    this.showState = this.route.snapshot.data.showState as boolean;
    this.getForms();
    this.getCompanyLink();
  }

  getCompanyLink(): void {
    this.api.getOwnCompanyLink().subscribe(
      (link) => (this.companyLink = link),
      () => this.msgr.error('There was a problem getting your link')
    );
  }

  getForms(): void {
    this.api.listForms(this.states).subscribe(
      (forms) => {
        this.forms = forms;
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to fetch forms')
    );
  }

  createForm(): void {
    this.api.createForm('New Form').subscribe(
      (form) => {
        this.msgr.message('Created form!');
        this.router.navigate([`/b/${form.link}`]);
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to create form')
    );
  }

  publish(id: string): void {
    this.updateForm(this.api.publishForm(id), 'Published form!', 'Failed to publish form');
  }

  archive(id: string): void {
    this.updateForm(this.api.archiveForm(id), 'Archived form!', 'Failed to archive form');
  }

  delete(id: string): void {
    this.updateForm(this.api.deleteForm(id), 'Deleted form!', 'Failed to delete form');
  }

  async copy(id: string, state: FormState, name: string): Promise<void> {
    let data: Form | ConstructionSave = await this.api.getOwnForm(id).toPromise();
    delete data.name;
    if (state !== 'unpublished') data = copy(data);
    this.updateForm(this.api.copyForm(name, data), 'Copied form!', 'Failed to copy form');
  }

  rename(id: string, current: string): void {
    const ref = this.dialog.open(GetNameDialogComponent, {
      width: '300px',
      data: current,
    });
    ref.beforeClosed().subscribe((name) => {
      if (name) {
        this.updateForm(this.api.renameForm(id, name), 'Renamed form!', 'Failed to rename form');
      }
    });
  }

  updateForm(request: Observable<void>, message: string, error: string): void {
    request.pipe(tap(() => this.msgr.message(message))).subscribe(
      () => this.getForms(),
      (err) => this.msgr.httpErrorHandler(err, error)
    );
  }

  share(id: string): void {
    if (!this.companyLink) {
      this.msgr.message('Please create a LINK in the settings tab', 3000);
      return;
    }
    void this.router.navigate([`/share/${id}`]);
  }
}

@Component({
  selector: 'app-get-name-dialog',
  templateUrl: 'get-name-dialog.html',
})
export class GetNameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GetNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public current: string
  ) {}

  noClick(): void {
    this.dialogRef.close();
  }
}

function copy(form: Form): ConstructionSave {
  return {
    endEnabled: !!form.ends,
    form: dupeForm(form),
    publish: form,
    startEnabled: !!form.start,
  };
}

function dupeForm(form: Form): ConstructionForm {
  form = JSON.parse(JSON.stringify(form)) as Form;
  const dupe: ConstructionForm = {
    design: form.design,
    endList: [],
    ends: {},
    name: form.name,
    questionList: [],
    questions: {},
    start: form.start,
  };
  const ids: { [pos: number]: string } = {};
  form.questions.forEach((q: Q, index: number) => {
    const uq = unique(q);
    dupe.questions[uq.id] = uq;
    dupe.questionList.push(uq.id);
    ids[index] = uq.id;
  });

  form.ends?.forEach((e: EndScreen, index: number) => {
    const ue = unique(e);
    dupe.ends[ue.id] = ue;
    dupe.endList.push(ue.id);
    ids[-(index + 1)] = ue.id;
  });

  dupe.defaultEnd = ids[form.defaultEnd];

  for (const id in dupe.questions) {
    if (!Object.prototype.hasOwnProperty.call(dupe.questions, id)) continue;
    dupeDescription(dupe.questions[id].conf.description as Description, ids);
    dupe.questions[id].conf.jumps.forEach((jump: If) => dupeJump(jump, ids));
  }
  return dupe;
}

function dupeDescription(description: Description, ids: { [pos: number]: string }): void {
  for (let i = 0; i < description.length; i++) {
    if (typeof description[i] === 'number') {
      (description as BuilderDescription)[i] = { qid: ids[description[i] as number] };
    }
  }
}

function dupeJump(jump: If, ids: { [pos: number]: string }): void {
  conditionLeafTraverser(jump.condition, (check: Check) => (check.check.q = ids[check.check.q as number]));
  jump.then = jump.then === 'null' ? 'null' : ids[Number(jump.then)];
}
