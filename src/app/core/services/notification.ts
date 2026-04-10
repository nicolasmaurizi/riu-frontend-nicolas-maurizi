import { inject, Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.open(message, ['notification-snackbar', 'notification-snackbar--success']);
  }

  error(message: string): void {
    this.open(message, ['notification-snackbar', 'notification-snackbar--error']);
  }

  info(message: string): void {
    this.open(message, ['notification-snackbar', 'notification-snackbar--info']);
  }

  private open(message: string, panelClass: string[]): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass,
    });
  }
}
