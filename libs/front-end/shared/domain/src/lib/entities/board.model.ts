import firebase from 'firebase/compat';
import FieldValue = firebase.firestore.FieldValue;
import { SummaryListCardTypesInOrder } from './summary-list-card-types.type';
import { List } from './list.model';

export type Board = {
  id?: string;
  title: string;
  lists: List[];
  user: string;
  created: FieldValue;
  areListsEmpty?: boolean;
  summaryListIndex?: number;
  summaryListCardTypesInOrder?: SummaryListCardTypesInOrder;
  v?: number;
};
