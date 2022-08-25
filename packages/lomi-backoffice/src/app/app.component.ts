import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickersModalComponent } from 'packages/lomi-backoffice/pickers/components/pickers-modal/pickers-modal.component';
import { AuthService } from '../../providers/lomi/auth.service';
import { OrdersService } from '../../providers/lomi/orders.service';

@Component({
  selector: 'lomii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public userId:any = 0;

  constructor(
    public auth:AuthService,
    public orders:OrdersService,
    public dialog: MatDialog
    ){

  }

  title = 'lomi-material';

  openPickersDialog(): void {
    this.dialog.open(PickersModalComponent, {
    });
  }
}
