import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { BoardPreviewModule } from '@budgetello/front-end/home/ui/board-preview';
import { AddBoardFormModule } from '@budgetello/front-end/home/ui/add-board-form';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    BoardPreviewModule,
    AddBoardFormModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
