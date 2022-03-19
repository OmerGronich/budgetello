import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IList } from '../../services/boards/boards.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'budgetello-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHeaderComponent implements OnInit {
  @Input() list: IList;
  isEditingTitle$ = new BehaviorSubject(false);
  listTitleFormControl = new FormControl('', Validators.required);
  @Output() listTitleChanged = new EventEmitter();

  ngOnInit(): void {
    this.listTitleFormControl.setValue(this.list.title);
  }

  cancelEdit($event?: Event) {
    this.isEditingTitle$.next(false);
    this.listTitleFormControl.setValue(this.list.title);
  }

  startEditing($event: MouseEvent) {
    $event.stopPropagation();
    this.isEditingTitle$.next(true);
  }
}
