import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {UiKanbanBoardModule} from "@budgetello/ui/kanban-board";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UiKanbanBoardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
