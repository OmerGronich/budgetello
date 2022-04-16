import { DocumentReference } from '@angular/fire/compat/firestore';
import { LIST_OPERATORS } from '../../../constants';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

export interface Card {
  title?: string;
  amount?: string;
  stockSymbol?: string;
  shares?: number;
  name?: string;
  displayName?: string;
  created?: Timestamp;
  id?: string;
  disableDrag?: boolean;
}

export interface List extends Partial<DocumentReference> {
  type: LIST_OPERATORS;
  id?: string;
  title: string;
  cards: Card[];
  created?: Timestamp;
  disableDrag?: boolean;
  listEnterPredicate?(item?: any): boolean;
  lockAxis?: 'x' | 'y';
}

export type SummaryListCardType =
  | 'totalIncome'
  | 'totalExpenses'
  | 'netIncome'
  | 'savingsTarget'
  | 'discretionaryIncome';
export type SummaryListCardTypesInOrder = Array<SummaryListCardType>;
