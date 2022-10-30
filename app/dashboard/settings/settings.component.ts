import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/api/user';
import { ApiService } from 'src/app/api/api.service';
import { MessengerService } from 'src/app/messenger/messenger.service';
import { AuthService, JWTInfo } from 'src/app/auth/auth.service';
import { switchMap, tap } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { ChangeCompanyLinkDialogComponent } from './change-company-link-dialog/change-company-link-dialog.component';
import { Company } from '../../api/company';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user: User = {
    firstName: 'Loading...',
    lastName: 'Loading...',
    email: 'Loading...',
    id: undefined,
    role: 'member',
  };
  users: User[] = undefined;

  company: Partial<Company> = {
    name: 'Loading...',
    link: 'Loading...',
  };

  displayedColumns = ['firstName', 'lastName', 'email', 'role', 'verify', 'actions'];
  namesEdited = false;
  companyEdited = false;
  prefix = 'https://feedback-analytics.com/f/';
  suffix = '/abc123';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private msgr: MessengerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getInfo();
    this.getUserManagement();
    this.getCompany();
  }

  getInfo(): void {
    this.api.getSelf().subscribe(
      (user) => (this.user = user),
      (err) => this.msgr.httpErrorHandler(err, 'Failed to fetch user info')
    );
  }

  getUserManagement(): void {
    this.auth
      .getAccessTokenInfo()
      .pipe(
        switchMap((token: JWTInfo) => {
          if (token.role === 'admin' || token.role === 'owner') {
            return this.api.getUsers();
          }
          return of(null);
        })
      )
      .subscribe(
        (users: User[]) => (this.users = users),
        (err) => this.msgr.httpErrorHandler(err, 'Failed to fetch user accounts')
      );
  }

  getCompany(): Subscription {
    return this.api.getOwnCompany().subscribe(
      (company) => {
        this.company = company;
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to fetch company details')
    );
  }

  updateUsers(request: Observable<User | void>, message: string, error: string): void {
    request.pipe(tap(() => this.msgr.message(message))).subscribe(
      () => this.getUserManagement(),
      (err) => this.msgr.httpErrorHandler(err, error)
    );
  }

  addUser(): void {
    this.dialog
      .open(GetUserDialogComponent, {
        width: '300px',
        data: {
          title: 'Create User',
          user: {
            firstName: '',
            lastName: '',
            email: '',
            role: 'member',
          },
          action: 'Done',
        },
      })
      .beforeClosed()
      .subscribe((user: User) => {
        if (user) {
          this.updateUsers(
            this.api.createUser(user),
            `Created new user ${user.firstName} ${user.lastName}`,
            `Failed to create new user ${user.firstName} ${user.lastName}`
          );
        }
      });
  }

  editUser(user: User): void {
    this.dialog
      .open(GetUserDialogComponent, {
        width: '300px',
        data: {
          title: 'Edit User',
          user: Object.assign({}, user),
          action: 'Save',
          disableEmail: true,
        },
      })
      .beforeClosed()
      .subscribe((newUser: User) => {
        if (newUser) {
          this.updateUsers(this.api.editUser(user.id, newUser), `Changes saved`, `Failed to save changes`);
        }
      });
  }

  deleteUser(user: User): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '260px',
        data: {
          title: 'Confirm deletion',
          action: 'Delete',
        },
      })
      .beforeClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          if (user.id !== this.user.id) {
            this.updateUsers(this.api.deleteUser(user.id), `User deleted`, `Failed to delete user`);
          } else {
            this.api.deleteUser(user.id).subscribe(
              () => this.auth.logout(),
              (error) => this.msgr.httpErrorHandler(error, `Failed to delete user`)
            );
          }
        }
      });
  }

  saveNames(): void {
    this.namesEdited = false;
    this.api.editUser(this.user.id, this.user).subscribe(
      () => this.msgr.message('Saved changes'),
      (error) => {
        this.msgr.httpErrorHandler(error, 'Failed to save changes');
        this.namesEdited = true;
      }
    );
  }

  changePassword(): void {
    this.dialog
      .open(ChangePasswordDialogComponent, { width: '300px' })
      .beforeClosed()
      .subscribe((res: { oldPassword: string; newPassword: string }) => {
        if (res) {
          this.api.changeOwnPassword(res.oldPassword, res.newPassword).subscribe(
            () => this.msgr.message('Changed password'),
            (error) => this.msgr.httpErrorHandler(error, 'Failed to change password')
          );
        }
      });
  }

  /**
   * change the link of the current company
   */
  changeCompanyLink(): void {
    this.dialog
      .open(ChangeCompanyLinkDialogComponent, {
        width: '500px',
        data: { companyLink: this.company.link },
      })
      .beforeClosed()
      .subscribe((res: { newCompanyLink: string }) => {
        if (res) {
          this.api.setOwnCompanyLink({ companyLink: res.newCompanyLink }).subscribe(
            () => {
              this.msgr.message('Changed company link');
              this.getCompany();
            },
            (error) => this.msgr.httpErrorHandler(error, 'Failed to change share link!')
          );
        }
      });
  }

  saveCompanyName(): void {
    this.companyEdited = false;
    this.api.setOwnCompanyName({ companyName: this.company.name }).subscribe(
      () => {
        this.msgr.message('Saved changes');
        this.getCompany();
      },
      (error) => {
        this.msgr.httpErrorHandler(error, 'Failed to save changes');
        this.namesEdited = true;
      }
    );
  }

  disable($event: MouseEvent): void {
    $event.preventDefault();
  }

  verifyUser(user: User): void {
    this.api.resendVerificationEmail(user.id).subscribe(
      () => this.msgr.message(`A verification email was sent to ${user.email}.`),
      (err) => this.msgr.httpErrorHandler(err, 'Failed to send verification email to user')
    )
  }
}

@Component({
  selector: 'app-get-user-dialog',
  templateUrl: 'dialogs/get-user-dialog.html',
})
export class GetUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GetUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; user: User; disableEmail: boolean; action: string }
  ) {}

  noClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: 'dialogs/delete-confirmation-dialog.html',
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; action: string }
  ) {}

  noClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: 'dialogs/change-password-dialog.html',
})
export class ChangePasswordDialogComponent {
  constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>) {}
  oldPassword = '';
  newPassword = '';
  retypedPassword = '';

  savePassword(): void {
    this.dialogRef.close({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    });
  }

  noClick(): void {
    this.dialogRef.close();
  }
}
