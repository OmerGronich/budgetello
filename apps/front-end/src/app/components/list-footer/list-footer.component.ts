import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LIST_OPERATORS, LIST_TYPES } from '../../constants';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  defaultIfEmpty,
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

interface StockSuggestion {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

interface StockApiResponse {
  bestMatches: StockSuggestion[];
}

@Component({
  selector: 'budgetello-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFooterComponent {
  @Input() total: number;
  @Input() type: LIST_OPERATORS;
  @Output() submitNewCard = new EventEmitter<{
    submitEvent: SubmitEvent;
    cardTitle: string;
    amount: string;
  }>();

  stock = LIST_TYPES.Stock;
  isCreatingCard = false;
  form: FormGroup;
  stockSuggestions: { label: string; value: StockSuggestion }[] = [];

  get cardTitleFormControl(): FormControl {
    return this.form.get('cardTitle') as FormControl;
  }

  get cardAmountFormControl(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get selectedStock(): FormControl {
    return this.form.get('selectedStock') as FormControl;
  }

  get isSummary() {
    return this.type === LIST_TYPES.Summary;
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      cardTitle: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      selectedStock: new FormControl(),
    });
  }

  stopCreatingCard($event: Event) {
    this.isCreatingCard = false;
    this.form.reset();
  }

  submitCard($event: SubmitEvent) {
    $event.preventDefault();
    if (this.form.valid) {
      this.submitNewCard.emit({
        submitEvent: $event,
        cardTitle: this.form.controls['cardTitle'].value,
        amount: this.form.controls['amount'].value,
      });
      this.isCreatingCard = false;
      this.form.reset();
    }
  }

  searchStock({ query }: { query: string; originalEvent: InputEvent }) {
    this.http
      .get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${
          query || 'apple'
        }&apikey=`
      )
      .pipe(
        distinctUntilChanged(),
        defaultIfEmpty({ bestMatches: [] } as any),
        map(({ bestMatches }: StockApiResponse) =>
          bestMatches.map((suggestion) => ({
            label: suggestion['2. name'],
            value: suggestion,
          }))
        )
      )
      .subscribe((suggestions) => {
        this.stockSuggestions = suggestions;
        this.cdr.markForCheck();
      });
  }
}
