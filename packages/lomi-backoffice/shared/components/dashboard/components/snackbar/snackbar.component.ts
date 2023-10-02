import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnChanges {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @Input() dateError = false;
  constructor(private _snackBar: MatSnackBar) {}

  ngOnChanges(): void {
    if (this.dateError) {
      this.openSnackBar();
    }
  }
  openSnackBar() {
    this._snackBar.open(
      '¡Atención: Las fechas seleccionadas no deben superar la fecha actual!',
      '',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['.snackbar-bg'],
        duration: 5000,
      }
    );
  }
}
