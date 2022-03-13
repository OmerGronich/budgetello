import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { NavbarModule } from '../navbar/navbar.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  imports: [CommonModule, NavbarModule, RouterModule],
})
export class LayoutModule {}
