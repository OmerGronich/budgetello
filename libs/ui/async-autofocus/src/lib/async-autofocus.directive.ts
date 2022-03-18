import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[budgetelloAsyncAutofocus]',
})
export class AsyncAutofocusDirective implements OnChanges, OnDestroy {
  @Input() budgetelloAsyncAutofocus: boolean;

  _timeoutId: number;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['budgetelloAsyncAutofocus'] &&
      changes['budgetelloAsyncAutofocus'].currentValue
    ) {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
      }

      this._timeoutId = setTimeout(() => {
        this.el.nativeElement.focus();
      }, 1) as unknown as number;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this._timeoutId);
  }
}
