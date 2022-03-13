import { Component, Input } from '@angular/core';

@Component({
  selector: 'budgetello-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent {
  @Input() link: string;
  title = 'Budgetello';
}
