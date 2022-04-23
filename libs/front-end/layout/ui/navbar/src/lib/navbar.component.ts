import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@budgetello/front-end/shared/utils/auth';
import firebase from 'firebase/compat';

@Component({
  selector: 'budgetello-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  items: MenuItem[];

  constructor(public authService: AuthService) {}

  getImageFromUser(user: firebase.User) {
    if (user.photoURL) {
      return user.photoURL;
    }

    const url = new URL('https://ui-avatars.com/api/');
    url.searchParams.append('name', user.displayName || '');
    return url.toString();
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.signOut();

          // todo refactor this ugly line some day
          window.location.reload();
        },
      },
    ];
  }
}
