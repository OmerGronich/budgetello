import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {UiKanbanBoardModule} from "@budgetello/ui/kanban-board";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    UiKanbanBoardModule
  ]
})
export class HomeModule {
}
