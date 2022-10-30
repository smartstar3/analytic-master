import { Component, Input } from '@angular/core';
import { MessengerService } from '../../messenger/messenger.service';

@Component({
  selector: 'app-copy-link',
  templateUrl: './copy-link.component.html',
  styleUrls: ['./copy-link.component.scss'],
})
export class CopyLinkComponent {
  @Input() companyLink: string;

  constructor(private msgr: MessengerService) {}

  share(): void {
    const copyData = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData.setData('text/plain', this.companyLink);
      document.removeEventListener('copy', copyData);
    };
    document.addEventListener('copy', copyData);
    document.execCommand('copy');
    this.msgr.message('Link copied!');
  }
}
