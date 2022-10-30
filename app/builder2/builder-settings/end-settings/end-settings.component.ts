import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DEFAULT_END, EndService } from '../../services/end.service';
import { Subscription } from 'rxjs';
import { Selection, SelectionService } from '../../services/selection.service';
import {
  BodyChange,
  EndImageEnabledChange,
  EndImageChange,
  LinkChange,
  LinkEnabledChange,
  TitleChange,
  EndMailEnabledChange,
  EndMailChange,
} from '../../services/update/end-update';
import { UpdateType } from '../../services/update/update';
import { Image, ImageService } from '../../image-stuff/image.service';
import { MessengerService } from '../../../messenger/messenger.service';
import { PosService } from '../../services/pos.service';
import { User } from 'src/app/api/user';
import { ApiService } from '../../../api/api.service';
import { NameService } from '../../services/name.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-end-settings',
  templateUrl: './end-settings.component.html',
  styleUrls: ['./end-settings.component.scss'],
})
export class EndSettingsComponent implements OnInit, OnDestroy {
  control: FormGroup;
  users: User[] = [];

  selSub: Subscription;
  titleSub: Subscription;
  bodySub: Subscription;
  linkSub: Subscription;
  linkEnableSub: Subscription;
  imageEnableSub: Subscription;
  mailEnableSub: Subscription;
  mailSub: Subscription;
  private _file: File;

  constructor(
    public sel: SelectionService,
    public es: EndService,
    public pos: PosService,
    private fb: FormBuilder,
    public imageService: ImageService,
    public ns: NameService,
    private msgr: MessengerService,
    private api: ApiService,
    private route: ActivatedRoute
  ) {
    if (this.sel.type === 'end') {
      this.clearControlSubs();
      this.setControl();
    }
    this.selSub = this.sel.change.subscribe((selection: Selection) => {
      if (selection?.type !== 'end') return;
      this.clearControlSubs();
      this.setControl();
    });
  }

  ngOnInit(): void {
    if (this.control.get('mailEnabled').value) {
      this.getMemberEmails();
    }
  }

  getMemberEmails(): void {
    this.api.getMemberEmails().subscribe(
      (users: User[]) => (this.users = users),
      (err) => this.msgr.httpErrorHandler(err, 'Failed to fetch user accounts')
    );
  }

  addLink(): void {
    this.control.get('linkEnabled').setValue(true);
  }

  removeLink(): void {
    this.control.get('linkEnabled').setValue(false);
  }

  addImage(): void {
    this.control.get('imageEnabled').setValue(true);
  }

  removeImage(): void {
    this.control.get('imageEnabled').setValue(false);
  }

  addMail(): void {
    this.control.get('mailEnabled').setValue(true);
    this.getMemberEmails();
  }

  removeMail(): void {
    this.control.get('mailEnabled').setValue(false);
  }

  clearControlSubs(): void {
    this.titleSub?.unsubscribe();
    this.bodySub?.unsubscribe();
    this.linkSub?.unsubscribe();
    this.linkEnableSub?.unsubscribe();
    this.imageEnableSub?.unsubscribe();
    this.mailSub?.unsubscribe();
    this.mailEnableSub?.unsubscribe();
  }

  setControl(): void {
    this.control = this.createControl();
    this.titleSub = this.control.get('title').valueChanges.subscribe((title: string) => {
      this.es.update<TitleChange>({ title, type: UpdateType.EndTitleChange }, this.sel.id);
      this.es.get[this.sel.id].title = title;
    });
    this.bodySub = this.control.get('body').valueChanges.subscribe((body: string) => {
      this.es.update<BodyChange>({ body, type: UpdateType.EndBodyChange }, this.sel.id);
      this.es.get[this.sel.id].body = body;
    });
    this.linkSub = this.control.get('link').valueChanges.subscribe((link: { button: string; url: string }) => {
      this.es.update<LinkChange>({ link, type: UpdateType.EndLinkChange }, this.sel.id);
      this.es.get[this.sel.id].link = link;
    });
    this.linkEnableSub = this.control.get('linkEnabled').valueChanges.subscribe((enabled: boolean) => {
      this.es.update<LinkEnabledChange>({ enabled, type: UpdateType.EndLinkEnabledChange }, this.sel.id);
      this.es.get[this.sel.id].linkEnabled = enabled;
    });
    this.imageEnableSub = this.control.get('imageEnabled').valueChanges.subscribe((enabled: boolean) => {
      this.es.update<EndImageEnabledChange>({ enabled, type: UpdateType.EndImageEnabledChange }, this.sel.id);
      this.es.get[this.sel.id].imageEnabled = enabled;
    });
    this.mailEnableSub = this.control.get('mailEnabled').valueChanges.subscribe((enabled: boolean) => {
      this.es.update<EndMailEnabledChange>({ enabled, type: UpdateType.EndMailEnableChange }, this.sel.id);
      this.es.get[this.sel.id].mailEnabled = enabled;
    });
    this.mailSub = this.control
      .get('mail')
      .valueChanges.subscribe((mail: { subject: string; message: string; sendTo: string[]; linkUrl: string }) => {
        this.es.update<EndMailChange>({ mail, type: UpdateType.EndMailChange }, this.sel.id);
        this.es.get[this.sel.id].mail = mail;
      });
  }

  createControl(): FormGroup {
    const end = this.es.get[this.sel.id];

    const mail = end.mail || DEFAULT_END.mail;
    // set mail linkUrl
    const id = this.route.snapshot.paramMap.get('id');
    mail.linkUrl = `${environment.url}data/${id}?tab=1`;

    const mailFormGroup = {};
    for (const key in mail) {
      if (key === 'subject' && !mail[key]) {
        const subject: string = this.ns.name + ' - ' + -this.pos.get[this.sel.id];
        mailFormGroup[key] = new FormControl(subject);
      } else {
        mailFormGroup[key] = new FormControl(mail[key]);
      }
    }

    const group = {
      title: end.title ? end.title : DEFAULT_END.title,
      body: end.body ? end.body : DEFAULT_END.body,
      link: end.link ? this.fb.group(end.link) : this.fb.group(DEFAULT_END.link),
      linkEnabled: typeof end.linkEnabled === 'boolean' ? end.linkEnabled : DEFAULT_END.linkEnabled,
      imageEnabled: typeof end.imageEnabled === 'boolean' ? end.imageEnabled : DEFAULT_END.imageEnabled,
      mailEnabled: typeof end.mailEnabled === 'boolean' ? end.mailEnabled : DEFAULT_END.mailEnabled,
      mail: new FormGroup(mailFormGroup),
    };

    return this.fb.group(group);
  }

  get file(): File {
    return this._file;
  }

  set file(file: File) {
    this._file = file;
    this.imageService.upload(file).subscribe(
      (data) => {
        this.imageService.add(data);
        const { hash, name } = data;
        this.es.get[this.sel.id].image = { hash, name };
        this.es.update<EndImageChange>({ type: UpdateType.EndImageChange, image: { hash, name } }, this.sel.id);
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to upload image')
    );
  }

  onFileChange(event: Event): void {
    const { files } = event.target as HTMLInputElement;
    if (files.item(0)) this.file = files.item(0);
  }

  setImage(image: Image): void {
    this.imageService.add(image);
    const { hash, name } = image;
    this.es.get[this.sel.id].image = { hash, name };
    this.es.update<EndImageChange>({ type: UpdateType.EndImageChange, image: { hash, name } }, this.sel.id);
  }

  ngOnDestroy(): void {
    this.selSub?.unsubscribe();
    this.clearControlSubs();
  }
}
