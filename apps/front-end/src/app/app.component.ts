import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../environments/environment';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'budgetello-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private afs: AngularFirestore) {
    if (environment.useEmulators) {
      connectFirestoreEmulator(this.afs.firestore, 'localhost', 8080);
    }
  }
}
