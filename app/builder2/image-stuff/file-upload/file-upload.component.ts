import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true,
    },
  ],
})
export class FileUploadComponent {
  @Input() progress;
  private _file: File | null = null;

  get file(): File | null {
    return this._file;
  }

  set file(file: File | null) {
    this._file = file;
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList): void {
    this.file = event && event.item(0);
  }

  constructor(private host: ElementRef<HTMLInputElement>) {}

  writeValue(): void {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }
}
