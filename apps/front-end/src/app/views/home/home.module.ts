import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { BoardPreviewModule } from '../../components/board-preview/board-preview.module';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from 'ng-click-outside';
import { InputTextModule } from 'primeng/inputtext';
import { FrontEndSharedUiAsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { FrontEndSharedUiTextInputModule } from '@budgetello/front-end-shared-ui-text-input';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    BoardPreviewModule,
    RouterModule,
    ClickOutsideModule,
    InputTextModule,
    FrontEndSharedUiAsyncAutofocusModule,
    ReactiveFormsModule,
    FrontEndSharedUiTextInputModule,
  ],
})
export class HomeModule {}
