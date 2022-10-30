import { Pipe, PipeTransform } from '@angular/core';
import { Q, QuestionType } from 'src/app/question';
import { Answer } from 'src/app/api/api.service';
import { Counter } from './counter';

export type TimeSpan = 'weeks' | 'months' | 'years';
export type ViewType = 'percentage' | 'count';

// this pipe is very wack. Fix this shit another day
@Pipe({
  name: 'multiserializer',
})
export class MultiSerializerPipe implements PipeTransform {
  transform(data: Answer[], question: Q, timespan: TimeSpan, dataform: ViewType, cumulative: boolean) {
    const buckets: Bucket[] = makeBuckets(data, timespan);
    let formattedData;
    switch (dataform) {
      case 'percentage':
        formattedData = average(buckets, question, cumulative);
        break;
      case 'count':
        formattedData = count(buckets, question, cumulative);
        break;
    }
    return flip(formattedData, question);
  }
}

interface Bucket {
  date: Date;
  data: Answer[];
}

function makeBuckets(data: Answer[], timespan: TimeSpan): Bucket[] {
  if (data.length === 0) {
    return [];
  }
  const sorted: Answer[] = data.sort((a: Answer, b: Answer) => a.date.getTime() - b.date.getTime());
  const buckets: Bucket[] = [];
  let bucket: Bucket = { date: new Date(sorted[0].date), data: [] };
  bucket.date.setHours(0, 0, 0, 0);
  buckets.push({ date: incrementDate(bucket.date, timespan, -1), data: [] });
  let bucketEnd: Date = incrementDate(bucket.date, timespan);
  for (let i = 0; i < sorted.length; ) {
    if (sorted[i].date < bucketEnd) {
      bucket.data.push(sorted[i]);
      i++;
    } else {
      buckets.push(bucket);
      bucket = { date: new Date(bucketEnd), data: [] };
      bucketEnd = incrementDate(bucketEnd, timespan);
    }
  }
  buckets.push(bucket);
  return buckets;
}

function incrementDate(date: Date, timespan: TimeSpan, multiplier: number = 1): Date {
  const copy: Date = new Date(date);
  switch (timespan) {
    case 'months':
      copy.setMonth(copy.getMonth() + multiplier);
      break;
    case 'weeks':
      copy.setDate(copy.getDate() + multiplier * 7);
      break;
    case 'years':
      copy.setFullYear(copy.getFullYear() + multiplier);
      break;
  }
  return copy;
}

function count(buckets: Bucket[], question: Q, cumulative?: boolean) {
  const data = [];
  let counter: Counter = new Counter(question);
  for (const bucket of buckets) {
    counter = cumulative ? counter : new Counter(question);
    for (const answer of bucket.data) {
      counter.count(answer.answer);
    }
    counter.setValueZero();
    data.push({
      name: stringifyDate(bucket.date),
      series: counter.groups.map((group) => Object.assign({}, group, { extra: { total: counter.total } })),
    });
  }
  return data;
}

function average(buckets: Bucket[], question: Q, cumulative?: boolean) {
  const counted = count(buckets, question, cumulative);
  counted.forEach((bucket) => {
    for (const group of bucket.series) {
      group.value = group.value !== 0 ? group.value / group.extra.total : 0;
      group.value = Math.round(group.value * 100);
    }
  });
  return counted;
}

function flip(data, question: Q) {
  const flippedData = initializeFlipped(question);
  for (const bucket of data) {
    for (const value of bucket.series) {
      flippedData[value.name].series.push({
        name: bucket.name,
        value: value.value,
        extra: value.extra,
      });
    }
  }
  return Object.values(flippedData);
}

function initializeFlipped(question: Q) {
  const data = {
    No: undefined,
    Yes: undefined,
  };
  switch (question.conf.type) {
    case QuestionType.MultipleChoiceQ:
    case QuestionType.PictureChoiceQ:
      question.conf.choices.forEach((choice: string) => (data[choice] = { name: choice, series: [] }));
      break;
    case QuestionType.StarRatingQ:
      for (let i = 0; i < question.conf.max; i++) {
        data[`${i + 1}`] = { name: `${i + 1}`, series: [] };
      }
      break;
    case QuestionType.YesNoQ:
      data.No = { name: 'No', series: [] };
      data.Yes = { name: 'Yes', series: [] };
      break;
    case QuestionType.SliderChoiceQ:
      for (let i = 1; i <= 100; i++) {
        data[`${i}`] = { name: `${i}`, series: [] };
      }
      break;
    default:
      throw Error('not supposed to get here');
  }
  return data;
}

export function stringifyDate(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
