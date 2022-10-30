import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartType } from '../chart/chart.component';
import { Q, QuestionType } from 'src/app/question';
import { Answer } from 'src/app/api/api.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
})
export class VisualizationComponent implements OnInit, OnChanges {
  readonly charts = ChartType;
  type: ChartType;
  @Input() question: Q;
  @Input() answers: Answer[];
  @Input() index: number;
  filteredAnswers: Answer[];
  startDate: Date;
  endDate: Date;

  ngOnInit(): void {
    if (this.question) {
      this.type = defaultType(this.question.conf.type);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.answers) {
      this.filterAnswers();
    }
  }

  filterAnswers(): void {
    this.filteredAnswers = this.answers
      .filter((answer: Answer) => !this.endDate || answer.date < this.endDate)
      .filter((answer: Answer) => !this.startDate || answer.date > this.startDate);
  }
}

function defaultType(type: QuestionType): ChartType {
  switch (type) {
    case QuestionType.MultipleChoiceQ:
    case QuestionType.PictureChoiceQ:
    case QuestionType.YesNoQ:
      return ChartType.Pie;
    case QuestionType.StarRatingQ:
      return ChartType.Star;
    default:
      return ChartType.List;
  }
}
