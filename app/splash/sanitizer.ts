import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHTML',
})
export class SanitizerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
@Pipe({
  name: 'sanitizeStyle',
})
export class SanitizerStyle implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string, direction: number): SafeStyle {
    switch (direction) {
      case 0:
        return this.sanitizer.bypassSecurityTrustStyle('url(' + value + ') no-repeat left center');
      case 1:
        return this.sanitizer.bypassSecurityTrustStyle('url(' + value + ') no-repeat right center');
      case 2:
        return this.sanitizer.bypassSecurityTrustStyle('url(' + value + ') no-repeat center');
    }
  }
}
