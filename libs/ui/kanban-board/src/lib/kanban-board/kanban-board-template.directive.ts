import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[kanbanTemplate]',
})
export class KanbanBoardTemplateDirective {
  @Input('kanbanTemplate') name:
    | 'card'
    | 'addListForm'
    | 'listHeader'
    | 'listFooter';

  constructor(public template: TemplateRef<any>) {}

  getType(): string {
    return this.name;
  }
}
