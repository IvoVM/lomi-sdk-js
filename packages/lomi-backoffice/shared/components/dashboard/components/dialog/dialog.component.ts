import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ordersDataService } from '../../services/orders-data.service';
import { RangeDatePickerComponent } from '../rangeDatePicker/range-date-picker.component';
import { StockLocationsService } from '../../services/stock-locations.service';
import { DateRange } from '../../types/dashboard.types';
import { StockLocation } from '../../types/dashboard.types';
import { HeaderService } from '../header/service/header.service';
@Component({
  selector: 'lomii-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    RangeDatePickerComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  stockLocation!: StockLocation[];
  public settings!: FormGroup;
  selectedLocation!: string;

  daterange: DateRange = {
    startDate: '',
    endDate: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    private ordersService: ordersDataService,
    private StockLocationsService: StockLocationsService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.getStockLocations();
    this.selectedLocation =
      this.StockLocationsService.getLocalStorageLocation().value;
    this.settings = this.formBuilder.group({
      stockLocationId: [this.selectedLocation],
    });
  }

  getStockLocations() {
    this.StockLocationsService.stockLocations$.subscribe(
      (res: StockLocation[]) => {
        this.stockLocation = res;
      }
    );
  }

  onSubmit() {
    const formValues = this.settings.value;
    //Para obtener el nombre de la stockLocation se usa el id y el array this.stockLocation[].
    const location = this.StockLocationsService.findStockLocationById(
      formValues.stockLocationId,
      this.stockLocation
    );
    //Despúes se guarda en el LocalStorage el valor del nombre y el id de la stockLocation.
    this.StockLocationsService.saveStockLocation({
      value: formValues.stockLocationId,
      viewValue: location.viewValue,
    });

    //Es necesario verificar si existen startDate y endDate, y pasarlos como parámetro.
    if (this.daterange.startDate && this.daterange.endDate) {
      //Actualizar el header con los valores seleccionados.
      this.headerService.updateHeader(
        location.viewValue,
        this.daterange.startDate,
        this.daterange.endDate
      );
      //Solicitar nuevas órdenes con los valores seleccionados.
      this.ordersService.fetchOrders(
        formValues.stockLocationId,
        this.daterange.startDate,
        this.daterange.endDate
      );
    } else {
      //De lo contrario se usan los valores por defecto.
      this.headerService.updateHeader(location.viewValue);
      this.ordersService.fetchOrders(formValues.stockLocationId);
    }

    this.dialogRef.close();
  }

  handleDateRangeSelected(eventData: { startDate: string; endDate: string }) {
    this.daterange.startDate = eventData.startDate;
    this.daterange.endDate = eventData.endDate;
  }
}
