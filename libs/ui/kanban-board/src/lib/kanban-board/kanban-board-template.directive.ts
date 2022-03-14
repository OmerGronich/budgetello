import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[kanbanTemplate]',
})
export class KanbanBoardTemplateDirective {
  @Input() type: 'card' | 'addListForm';
  @Input('kanbanTemplate') name: string;

  constructor(public template: TemplateRef<any>) {}

  getType(): string {
    return this.name;
  }
}
