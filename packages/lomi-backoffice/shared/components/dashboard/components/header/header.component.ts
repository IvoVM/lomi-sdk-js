import { ordersDataService } from './../../services/orders-data.service';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lomii-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  orders = 0;
  valueToShow = 0;
  targetValue!: number;
  animationDuration = 2000;
  @Input() selected_daterange!: string;
  @Input() stockLocation!: string;

  constructor(private ordersService: ordersDataService) {}
  ngOnInit(): void {
    this.ordersService.getOrdersDataSubject().subscribe((res) => {
      this.orders = res.length;
      const total = res.reduce(
        (acumulado: any, objeto: any) => acumulado + parseFloat(objeto.total),
        0
      );
      this.targetValue = parseFloat(total.toFixed(2)); // Redondear a 2 decimales
      this.animateNumbersValue();
    });
  }

  animateNumbersValue() {
    const increment = Math.ceil(
      (this.targetValue - this.valueToShow) / (this.animationDuration / 16)
    ); // 16ms es el tiempo de un fotograma en la mayoría de los navegadores
    const interval = setInterval(() => {
      this.valueToShow += increment;
      if (this.valueToShow >= this.targetValue) {
        this.valueToShow = this.targetValue; // Asegurarse de que el valor objetivo se alcance exactamente
        clearInterval(interval); // Detener la animación cuando se alcanza el valor objetivo
      }
    }, 16);
  }
}
