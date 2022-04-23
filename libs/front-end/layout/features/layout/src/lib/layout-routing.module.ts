import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // children: [
    //   {
    //     path: '',
    //     loadChildren: () =>
    //       import('../home/home.module').then((m) => m.HomeModule),
    //     pathMatch: 'full',
    //   },
    //   {
    //     path: 'board/:id',
    //     loadChildren: () =>
    //       import('../board/board.module').then((m) => m.BoardModule),
    //     pathMatch: 'full',
    //   },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
