import { DocumentReference } from '@angular/fire/compat/firestore';
import { LIST_OPERATORS } from '../../../constants';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

export interface ICard {
  title: string;
  amount: string;
  created?: Timestamp;
  id?: string;
  disableDrag?: boolean;
}

export interface List extends Partial<DocumentReference> {
  type: LIST_OPERATORS;
  id?: string;
  title: string;
  cards: ICard[];
  created?: Timestamp;
  disableDrag?: boolean;
  doNotEnter?: boolean;
  lockAxis?: 'x' | 'y';
}

export type SummaryListCardType =
  | 'totalIncome'
  | 'totalExpenses'
  | 'netIncome'
  | 'savingsTarget'
  | 'discretionaryIncome';
export type SummaryListCardTypesInOrder = Array<SummaryListCardType>;
