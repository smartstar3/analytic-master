import { Injectable } from '@angular/core';
import { SelectionService, SelectionUpdateType } from './selection.service';
import { Subscription } from 'rxjs';

enum CarouselDirection {
  up,
  down,
}

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  private _midElement: number;
  private selectionSub: Subscription;
  private _isAnimating: boolean;
  private _showSubmitButton: boolean;

  get isAnimating(): boolean {
    return this._isAnimating;
  }

  get showSubmitButton(): boolean {
    return this._showSubmitButton;
  }

  constructor(private selectionService: SelectionService) {
    this._isAnimating = false;
    this._showSubmitButton = false;
    this.selectionSub = this.selectionService.selectedQuestionBehaviorSubject.subscribe((update) => {
      switch (update.selectionUpdateType) {
        case SelectionUpdateType.init:
          this._midElement = update.selectedQuestion;
          this._showSubmitButton = false;
          break;
        case SelectionUpdateType.next:
          this.animateUp();
          this._midElement = update.selectedQuestion;
          break;
        case SelectionUpdateType.previous:
          this.animateDown();
          this._midElement = update.selectedQuestion;
          break;
        default:
          console.log('unknown selection update');
      }
    });
  }

  toggleSubmitButton(): void {
    this._showSubmitButton = !this._showSubmitButton;
    this.animateButton();
  }

  animateUp(): void {
    const up = CarouselDirection.up;
    this.animateCarousel(up);
    this.toggleAnimation();
  }

  animateDown(): void {
    const down = CarouselDirection.down;
    this.animateCarousel(down);
    this.toggleAnimation();
  }

  private animateButton(): void {
    const button = document.getElementById(`submit-button`);
    if (!button) return;
    button.classList.remove('to-visible', 'to-invisible');
    if (this.showSubmitButton === false) {
      button.classList.add('to-invisible');
    } else {
      button.classList.add('to-visible');
    }
  }

  animateCarousel(direction: CarouselDirection): void {
    this.fromLowTo(direction);
    this.fromMidTo(direction);
    this.fromHighTo(direction);
  }

  private fromHighTo(direction: CarouselDirection) {
    const questionCard = document.getElementById(`card${this._midElement - 1}`);
    if (!questionCard) return;
    if (direction === CarouselDirection.down) {
      questionCard.classList.remove('from-mid-to-high');
      questionCard.classList.add('from-high-to-mid');
    }
  }

  private fromMidTo(direction: CarouselDirection) {
    const questionCard = document.getElementById(`card${this._midElement}`);
    if (!questionCard) return;
    questionCard.classList.remove('from-low-to-mid', 'from-high-to-mid');
    if (direction === CarouselDirection.up) {
      questionCard.classList.add('from-mid-to-high');
    } else {
      questionCard.classList.add('from-mid-to-low');
    }
  }

  private fromLowTo(direction: CarouselDirection) {
    const questionCard = document.getElementById(`card${this._midElement + 1}`);
    if (!questionCard) return;
    if (direction === CarouselDirection.up) {
      questionCard.classList.remove('from-mid-to-low');
      questionCard.classList.add('from-low-to-mid');
    }
  }

  private toggleAnimation() {
    this._isAnimating = true;
    setTimeout(() => (this._isAnimating = false), 700);
  }
}
