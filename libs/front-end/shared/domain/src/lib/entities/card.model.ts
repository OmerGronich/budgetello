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
