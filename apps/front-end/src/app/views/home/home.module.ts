import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { BoardPreviewModule } from '../../components/board-preview/board-preview.module';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from 'ng-click-outside';
import { InputTextModule } from 'primeng/inputtext';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    BoardPreviewModule,
    RouterModule,
    ClickOutsideModule,
    InputTextModule,
    UiAsyncAutofocusModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}
