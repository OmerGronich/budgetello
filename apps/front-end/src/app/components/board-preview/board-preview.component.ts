import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'budgetello-board-preview',
  templateUrl: './board-preview.component.html',
  styleUrls: ['./board-preview.component.scss'],
})
export class BoardPreviewComponent {
  @Input() boardTitle: string;
  @Output() clicked = new EventEmitter();
}
