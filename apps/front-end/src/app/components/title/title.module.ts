import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TitleComponent],
  imports: [CommonModule, RouterModule],
  exports: [TitleComponent],
})
export class TitleModule {}
