import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question-choice',
  templateUrl: './question-choice.component.html',
  styleUrls: ['./question-choice.component.scss'],
})
export class QuestionChoiceComponent {
  @Input() content: string;
  @Input() selected: boolean;
  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();

  updateContent(): void {
    this.contentChange.emit(this.content);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.content) {
      event.preventDefault();
      this.updateContent();
    }
  }
}
