import { DocumentReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

import { Card } from './card.model';
import { LIST_OPERATORS } from '../constants';

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
