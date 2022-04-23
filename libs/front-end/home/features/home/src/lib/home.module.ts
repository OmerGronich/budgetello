import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { FrontEndSharedUiTextInputModule } from '@budgetello/front-end-shared-ui-text-input';
import { ClickOutsideModule } from 'ng-click-outside';
import { BoardPreviewModule } from '@budgetello/front-end/home/ui/board-preview';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FrontEndSharedUiTextInputModule,
    ClickOutsideModule,
    BoardPreviewModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
