import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardPreviewComponent } from './board-preview.component';

@NgModule({
  declarations: [BoardPreviewComponent],
  imports: [CommonModule],
  exports: [BoardPreviewComponent],
})
export class BoardPreviewModule {}
