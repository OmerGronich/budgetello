import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { FrontEndSharedUiKanbanBoardModule } from '@budgetello/front-end-shared-ui-kanban-board';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { SharedModule } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { AsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';
import { BoardHeaderModule } from '../../components/board-header/board-header.module';
import { ListHeaderModule } from '../../components/list-header/list-header.module';
import { DropdownModule } from 'primeng/dropdown';
import { MapListOperatorToIconModule } from '../../pipes/map-list-operator-to-icon/map-list-operator-to-icon.module';
import { AddListFormModule } from '../../components/add-list-form/add-list-form.module';
import { ListFooterModule } from '../../components/list-footer/list-footer.module';
import { CalculateListTotalModule } from '../../pipes/calculate-list-total/calculate-list-total.module';
import { KanbanCardModule } from '../../components/kanban-card/kanban-card.module';
import { BoardRoutingModule } from './board-routing.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    BoardRoutingModule,
    CommonModule,
    FrontEndSharedUiKanbanBoardModule,
    ButtonModule,
    InplaceModule,
    SharedModule,
    InputTextModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    AsyncAutofocusModule,
    BoardHeaderModule,
    ListHeaderModule,
    DropdownModule,
    MapListOperatorToIconModule,
    AddListFormModule,
    ListFooterModule,
    CalculateListTotalModule,
    KanbanCardModule,
  ],
})
export class BoardModule {}
