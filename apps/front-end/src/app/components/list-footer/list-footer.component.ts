import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
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
  defaultIfEmpty,
  distinctUntilChanged,
  firstValueFrom,
  map,
  shareReplay,
  Subscription,
} from 'rxjs';
import { List } from '../../views/board/state/types';
import { AuthService } from '@budgetello/front-end/shared/utils/auth';
import { ToastService } from '@budgetello/front-end/shared/utils/toast';

interface Match {
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
  bestMatches: Match[];
}

interface StockSuggestion {
  symbol: string;
  name: string;
}

@Component({
  selector: 'budgetello-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFooterComponent implements OnInit, OnDestroy {
  @Input() list: List;
  @Input() total: number;
  @Input() type: LIST_OPERATORS;
  @Output() incomeExpenseCardSubmitted = new EventEmitter<{
    submitEvent: SubmitEvent;
    cardTitle: string;
    amount: string;
  }>();
  @Output() stockCardSubmitted = new EventEmitter<{
    submitEvent: SubmitEvent;
    stockSymbol: string;
    name: string;
    displayName: string;
    shares: number;
  }>();

  stock = LIST_TYPES.Stock;
  isCreatingCard = false;
  addIncomeExpenseCardForm: FormGroup;
  addStockCardForm: FormGroup;
  stockSuggestions: StockSuggestion[] = [];

  subscriptions: Subscription[] = [];

  defaultQuery = 'a';

  get incomeExpenseCardTitleFormControl(): FormControl {
    return this.addIncomeExpenseCardForm.get('cardTitle') as FormControl;
  }

  get incomeExpenseCardAmountFormControl(): FormControl {
    return this.addIncomeExpenseCardForm.get('amount') as FormControl;
  }

  get selectedStock(): FormControl {
    return this.addStockCardForm.get('selectedStock') as FormControl;
  }
  get shares(): FormControl {
    return this.addStockCardForm.get('shares') as FormControl;
  }

  get isSummary() {
    return this.type === LIST_TYPES.Summary;
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private toast: ToastService
  ) {
    this.addIncomeExpenseCardForm = this.fb.group({
      cardTitle: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
    });

    this.addStockCardForm = this.fb.group({
      selectedStock: new FormControl(null, [Validators.required]),
      shares: new FormControl(0, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.selectedStock.valueChanges.subscribe(() => {
        if (this.selectedStock.invalid) {
          this.shares.disable();
        } else {
          this.shares.enable();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  stopCreatingCard($event: Event) {
    $event.preventDefault();
    this.isCreatingCard = false;
    this.addIncomeExpenseCardForm.reset();
    this.addStockCardForm.reset();
  }

  submitIncomeExpenseCard($event: SubmitEvent) {
    $event.preventDefault();
    if (this.addIncomeExpenseCardForm.valid) {
      this.incomeExpenseCardSubmitted.emit({
        submitEvent: $event,
        cardTitle: this.addIncomeExpenseCardForm.controls['cardTitle'].value,
        amount: this.addIncomeExpenseCardForm.controls['amount'].value,
      });
      this.isCreatingCard = false;
      this.addIncomeExpenseCardForm.reset();
    }
  }

  async searchSymbol({
    query: q,
  }: {
    query: string;
    originalEvent?: InputEvent;
  }) {
    const user = await firstValueFrom(this.auth.user$);
    const idToken = await user?.getIdToken(true);

    this.http
      .get('/api/search-symbols', {
        params: { q },
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      .pipe(
        shareReplay(1),
        distinctUntilChanged(),
        defaultIfEmpty({ bestMatches: [] } as any),
        map(({ bestMatches = [] }: StockApiResponse) =>
          bestMatches.map((suggestion) => ({
            name: suggestion['2. name'],
            symbol: suggestion['1. symbol'],
            displayName:
              suggestion['2. name'] + ' (' + suggestion['1. symbol'] + ')',
          }))
        )
      )
      .subscribe((suggestions) => {
        this.stockSuggestions = suggestions;
        this.cdr.markForCheck();
      });
  }

  submitStockCard($event: SubmitEvent) {
    $event.preventDefault();
    if (
      this.list.cards.some(
        (card) => card.stockSymbol === this.selectedStock.value.symbol
      )
    ) {
      for (const key in this.addStockCardForm.controls) {
        const control = this.addStockCardForm.controls[key];
        control.setErrors({
          duplicateStock: true,
        });
      }
      this.toast.duplicateStock();
      return;
    }

    this.stockCardSubmitted.emit({
      submitEvent: $event,
      stockSymbol: this.selectedStock.value.symbol,
      name: this.selectedStock.value.name,
      displayName: `${this.selectedStock.value.name} (${this.selectedStock.value.symbol})`,
      shares: this.shares.value,
    });
    this.addStockCardForm.reset();
    this.isCreatingCard = false;
  }
}
