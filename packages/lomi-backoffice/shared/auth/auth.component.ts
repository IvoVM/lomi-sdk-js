import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/lomi/auth.service';

@Component({
  selector: 'lomii-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(
    public auth:AuthService
  ) {}

  ngOnInit(): void {}
}
