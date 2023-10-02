import { DatesService } from '../../services/dates.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DateRange } from '../../types/dashboard.types';

@Component({
  selector: 'app-range-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SnackbarComponent,
  ],
  templateUrl: './range-date-picker.component.html',
  styleUrls: ['./range-date-picker.component.scss'],
  providers: [DatePipe],
})
export class RangeDatePickerComponent {
  form!: FormGroup;
  @Output() dateRangeSelected: EventEmitter<DateRange> = new EventEmitter();
  public dateError: boolean = false;

  constructor(
    fb: FormBuilder,
    private datePipe: DatePipe,
    private DatesService: DatesService
  ) {
    this.form = fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required],
    });
  }
  onSubmit() {
    const startDate = this.DatesService.formatDate(this.form.value.start);
    const endDate = this.DatesService.formatDate(this.form.value.end);
    if (
      this.form.valid &&
      this.DatesService.dateRangeValidator(startDate, endDate)
    ) {
      let daterange = { startDate, endDate };
      this.dateRangeSelected.emit(daterange);
    } else {
      this.dateError = true;
    }
  }
}
