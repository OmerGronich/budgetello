import { List, SummaryListCardTypesInOrder } from './types';
import firebase from 'firebase/compat';
import FieldValue = firebase.firestore.FieldValue;

export type Board = {
  id?: string;
  title: string;
  lists: List[];
  user: string;
  created: FieldValue;
  areListsEmpty?: boolean;
  summaryListIndex?: number;
  summaryListCardTypesInOrder?: SummaryListCardTypesInOrder;
};
