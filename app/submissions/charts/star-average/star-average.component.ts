import { Component, Input } from '@angular/core';
import { Q } from 'src/app/question';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-star-average',
  templateUrl: './star-average.component.html',
  styleUrls: ['./star-average.component.scss'],
})
export class StarAverageComponent {
  @Input() average: number;
  @Input() question: Q;
  console = console;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.loadSVG();
  }

  background(i: number, y: number): string {
    if (i < y) return '#ffc107';
  }

  loadSVG(): void {
    for (let i = 1; i <= 10; i++) {
      this.matIconRegistry.addSvgIcon(
        i.toString(),
        this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/img/emoticonRating/${i}.svg`)
      );
    }
  }

  SVGIcon(i: number): number {
    let x: number;
    if (i % 1 < 0.5) x = Math.floor(i);
    else x = Math.ceil(i);
    return (10 * x) / this.question.conf.max;
  }
}
