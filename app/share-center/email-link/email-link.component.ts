import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareInfo } from '../../resources/interfaces/share-info.interface';
import XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { Image, ImageService } from '../../builder2/image-stuff/image.service';
import { MessengerService } from '../../messenger/messenger.service';
import { MatDialog } from '@angular/material/dialog';
import { QuillEditorComponent } from 'ngx-quill';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from '../../utils/utils.service';
import { EmailSendingDialogComponent } from './email-bulking-dialog/email-sending-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-email-link',
  templateUrl: './email-link.component.html',
  styleUrls: ['./email-link.component.scss'],
})
export class EmailLinkComponent implements OnInit {
  fid: string;
  userCSVUrl = '';
  manualForm: FormGroup;
  shareInfos: ShareInfo[];
  xlsxReader: FileReader;
  companyLogo: Image;
  companyLogoLink: string;
  messageExtraData = [];
  isLoading = false;
  emailTemplate = '<p>Dear, #firstname#!</p><p>Please click the button to fill in the form.</p>';
  emailSubject = '';
  emailPreviewMode = false;
  emailVariableFields: string[] = ['firstname'];
  faSpinner = faSpinner;
  loadingFileByUrl = false;
  answerBtnText = 'Go to the form';
  answerBtnColor = '#224596';
  answerBtnTextColor = '#FFFFFF';
  messageFormModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
    ],
  };
  dragItems: { type: string; content?: string; }[] = [];

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild(QuillEditorComponent, { static: true }) editor: QuillEditorComponent;

  @Input() companyLink: string;
  @Input() getEmailStatus: () => void;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private is: ImageService,
    private msgr: MessengerService,
    public dialog: MatDialog,
    private us: UtilsService
  ) {
    this.initMailContent();

    this.manualForm = this.formBuilder.group({
      name: ['', Validators.pattern(/^\D+$/)],
      email: ['', [Validators.email, Validators.required]],
    });
    this.shareInfos = [];

    this.xlsxReader = new FileReader();
    this.xlsxReader.onload = (e) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      let convertOptions = {};
      // Use second row for header for spreadsheet url.
      if (this.loadingFileByUrl) {
        convertOptions = { range: 1 };
        this.loadingFileByUrl = false;
      }
      const result = XLSX.utils.sheet_to_json(worksheet, convertOptions);

      this.addEmailsFromFile(result);
    };
  }

  ngOnInit(): void {
    this.fid = this.route.snapshot.paramMap.get('fid');
    // this.getForm();
  }

  initMailContent(): void {
    const mailContent = document.createElement('div');
    mailContent.innerHTML = this.emailTemplate;

    const paragraphs = mailContent.children;

    this.dragItems = [];
    for (let i = 0; i < paragraphs.length; i ++) {
      this.dragItems.push({
        type: 'paragraph',
        content: paragraphs[i].outerHTML
      });
    }

    this.dragItems.push({
      type: 'button'
    });
  }

  initData(): void {
    this.userCSVUrl = '';
    this.shareInfos = [];
    this.messageExtraData = [];
    this.emailVariableFields = ['firstname'];
  }

  getForm(): void {
    this.api.getOwnForm(this.fid).subscribe(
      (form) => {
        if (form.start && form.start.imageEnabled && form.start.image.hash) {
          this.companyLogo = this.is.imageMap.get(form.start.image.hash);
          if (!this.companyLogo) {
            this.is.retrieve(form.start.image.hash).subscribe(
              (im) => {
                this.is.add(im);
                this.companyLogo = this.is.imageMap.get(form.start.image.hash);
                this.companyLogoLink = `data:image/png;base64,${this.companyLogo?.buffer.toString('base64')}`;
              },
              (err) => this.msgr.httpErrorHandler(err, 'Failed to retrieve image')
            );
          }
          this.companyLogoLink = `data:image/png;base64,${this.companyLogo?.buffer.toString('base64')}`;
        }
      },
      () => this.msgr.error('There is a problem getting your form')
    );
  }

  onFetchUserInfoFromUrl(): void {
    this.loadingFileByUrl = true;

    fetch(this.userCSVUrl, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        }
      })
      .then((blob) => {
        this.xlsxReader.readAsArrayBuffer(blob);
      })
      .catch((error) => {
        this.loadingFileByUrl = false;
        throw error;
      });
  }

  onManualForm(data: ShareInfo): void {
    this.shareInfos.push(data);
    this.messageExtraData.push({});
    this.manualForm.reset();
  }

  removeShareInfo(index: number): void {
    this.shareInfos.splice(index, 1);
    this.messageExtraData.splice(index, 1);
  }

  onImportFile(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange($event: Event): void {
    const files = ($event.target as HTMLInputElement).files;

    if (files[0]) {
      this.xlsxReader.readAsArrayBuffer(files[0]);
      this.fileInput.nativeElement.value = null;
    }
  }

  addNameAndEmail(name: string, email: string): boolean {
    if (this.us.checkValidName(name) && this.us.checkValidEmail(email)) {
      this.shareInfos.push({
        name,
        email,
      });

      return true;
    }

    return false;
  }

  addEmailsFromFile(data: unknown[]): void {
    if (data.length) {
      const keys = Object.keys(data[0]);

      if (keys.indexOf('name') === -1) {
        this.msgr.error('Cannot find name field!');
        return;
      }

      if (keys.indexOf('email') === -1) {
        this.msgr.error('Cannot find email field!');
        return;
      }

      let passedItemCount = 0;
      data.forEach((item: { name: string; email: string }) => {
        if (this.addNameAndEmail(item.name, item.email)) {
          const extraData = {};
          for (const key of keys) {
            if (key !== 'name' && key !== 'email') {
              extraData[key] = item[key] as string;
            }
          }
          this.messageExtraData.push(extraData);
          passedItemCount++;
        }
      });

      if (passedItemCount === 0) {
        this.msgr.error('Invalid Data Format!');
      }

      const variables = keys.filter((key) => key !== 'name' && key !== 'email' && key !== '1');
      this.emailVariableFields = [...this.emailVariableFields, ...variables];
    } else {
      this.msgr.error('Invalid Data!');
    }
  }

  addEmailVariable(variable: string): void {
    this.emailTemplate += `<span>#${variable}#</span>`;
  }

  toggleEmailViewMode(): void {
    this.emailPreviewMode = !this.emailPreviewMode;

    if (this.emailPreviewMode) {
      this.initMailContent();
    }
  }

  checkMessageContent(): void {
    const message = this.dragItems
      .filter((item) => item.type === 'paragraph')
      .map((item) => item.content)
      .join('');

    if (message !== this.emailTemplate) {
      this.initMailContent();
    }
  }

  onShareFormLink(): void {
    if (!this.checkValidEmailContent()) {
      return;
    }

    this.isLoading = true;

    this.checkMessageContent();

    const buttonIndex = this.dragItems.findIndex((item) => item.type === 'button');
    const message1 = this.dragItems.slice(0, buttonIndex)
      .map((item) => item.content)
      .join('');
    const message2 = this.dragItems.slice(buttonIndex + 1, this.dragItems.length)
      .map((item) => item.content)
      .join('');

    this.shareInfos = this.shareInfos.map((shareInfo, index) => {
      const firstName = shareInfo.name.split(' ')[0];

      shareInfo.message = message1.replace(/#firstname#/g, firstName);
      shareInfo.message2 = message2.replace(/#firstname#/g, firstName);

      for (const variable of this.emailVariableFields) {
        if (variable !== 'firstname') {
          // should type here too
          shareInfo.message = shareInfo.message.replace(
            new RegExp(`#${variable}#`, 'g'),
            this.messageExtraData[index][variable] ? this.messageExtraData[index][variable] : ''
          );
          shareInfo.message2 = shareInfo.message2.replace(
            new RegExp(`#${variable}#`, 'g'),
            this.messageExtraData[index][variable] ? this.messageExtraData[index][variable] : ''
          );
        }
      }

      shareInfo.subject = this.emailSubject;
      shareInfo.answerBtnText = this.answerBtnText;
      shareInfo.answerBtnColor = this.answerBtnColor;
      shareInfo.answerBtnTextColor = this.answerBtnTextColor;

      return shareInfo;
    });

    this.dialog.open(EmailSendingDialogComponent, { data: { shareInfos: this.shareInfos, fid: this.fid, companyLink: this.companyLink } }).afterClosed().subscribe(() => {
      this.getEmailStatus();
      this.initData();
      this.isLoading = false;
    });
  }

  checkValidEmailContent(): boolean {
    if (!this.shareInfos.length) {
      this.msgr.error('Please input email addresses and user names.');
      return false;
    }

    if (!this.emailSubject) {
      this.msgr.error('Please enter your email subject.');
      return false;
    }

    if (!this.emailTemplate) {
      this.msgr.error('Please enter your email message.');
      return false;
    }

    if (!this.answerBtnText) {
      this.msgr.error('Please enter your answer button text.');
      return false;
    }

    return true;
  }

  onButtonDrop(event: CdkDragDrop<any>): void {
    moveItemInArray(this.dragItems, event.previousIndex, event.currentIndex);
  }
}
