import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

// todo change displayName and name to relate more to stocks
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
