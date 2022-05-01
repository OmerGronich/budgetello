import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBoardFormComponent } from './add-board-form.component';
import { TextInputModule } from '@budgetello/front-end-shared-ui-text-input';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [CommonModule, TextInputModule, ClickOutsideModule],
  declarations: [AddBoardFormComponent],
  exports: [AddBoardFormComponent],
})
export class AddBoardFormModule {}
