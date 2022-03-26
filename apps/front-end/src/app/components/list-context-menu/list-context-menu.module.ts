import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListContextMenuComponent } from './list-context-menu.component';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [ListContextMenuComponent],
  imports: [CommonModule, ButtonModule, MenuModule],
  exports: [ListContextMenuComponent],
})
export class ListContextMenuModule {}
