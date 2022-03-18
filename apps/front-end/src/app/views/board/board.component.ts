import { Component } from '@angular/core';

@Component({
  selector: 'budgetello-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  lists = [
    {
      title: 'lorem',
      cards: [
        {
          title:
            'lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20lorem20',
        },
      ],
    },
  ];
}
