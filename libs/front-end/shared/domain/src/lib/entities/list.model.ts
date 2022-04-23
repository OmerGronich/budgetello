import { DocumentReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;
import { LIST_OPERATORS } from '@budgetello/front-end-shared-domain';
import { Card } from './card.model';

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
