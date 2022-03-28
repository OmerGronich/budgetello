import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCardDialogComponent } from './kanban-card-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InplaceModule } from 'primeng/inplace';
import { SharedModule } from 'primeng/api';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [KanbanCardDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InplaceModule,
    SharedModule,
    UiAsyncAutofocusModule,
    InputTextModule,
  ],
})
export class KanbanCardDialogModule {}
