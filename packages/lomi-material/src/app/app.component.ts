import { Component } from '@angular/core';
import { AuthService } from '../../providers/lomi/auth.service';

@Component({
  selector: 'lomii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(public auth:AuthService){

  }

  title = 'lomi-material';
}
