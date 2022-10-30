import { Component } from '@angular/core';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss'],
})
export class SolutionsComponent {
  builderText =
    'The form builder allows you to build a custom form to suit your own goals. ' +
    'Every question in the form provides the possibility to nudge your clients in the right direction. ' +
    'To described the flow of the builder, we use logic jumps. ' +
    'These jumps allow you to refer to any prior question and use these questions as decision points. ';

  builderText2 =
    "Do not waste your customer's valuable time any longer, with impersonal and irrelevant questions. " +
    'In turn, this makes it simple to track unsatisfied customers and turn them into satisfied customers, before they submit their form. ' +
    'Our form builder offers more than ten different question types.';

  designText =
    'Our software can scale on demand regardless of the number of users,' +
    ' number of forms or number of submissions. ' +
    'We believe that forms should be personal, therefore our forms are fully customisable. ' +
    "Changing the font style, colors, and background of the forms is child's play. " +
    'You can also add your own logo to fit your design needs.';

  analyticsText =
    'Our system allows you to easily collect feedback from your customers. ' +
    'The built-in logic structure enables you to reconstruct the flow of your questions and determine which question ' +
    'your customers get to see.';

  analyticsText2 =
    'Our software can filter data to match your needs (e.g. filtering keywords from responses of your customers). ' +
    'No more raw data (unless you want to) and manually processing data. ';

  analyticsText3 =
    'Feedback-Analytics shows insight into patterns and trends in your responses to enhance your business and the experience of your customers. ' +
    'Make educated decisions by using our software tailored to your specific wishes and requirements. ';

  optimiseText =
    'To maximise the conversion rate provided by your clients, we have made our forms responsive to all devices. ' +
    'Our aim is to create easy-to-use software to provide a great user experience. ' +
    'Filling in our forms is fast and easy, as it should be.';

  reviewText =
    'Logic Jumps make it easy to identify satisfied and unsatisfied customers. ' +
    'Satisfied customers can be redirected to a review page of your choice. ' +
    'If you do find an unsatisfied customer, use our software to satisfy them or hand them over to your support staff. ' +
    'By capturing the dissatisfied customers early on, you will be able to end up with more positive ratings at the end of the day. ' +
    "This will gain your customer's trust in your business and ensure prosperous business.";
}
