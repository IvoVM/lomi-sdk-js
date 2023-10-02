import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TopProductsComponent } from '../../top-products.component';
import { GraphicData } from '../../../../types/top-products.types';

@Component({
  selector: 'lomii-graphic',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, TopProductsComponent],
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss'],
})
export class GraphicComponent implements OnChanges {
  @Input() data!: GraphicData;
  donutData: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.donutData = {
        pieseries: this.data.porcentajes,
        labels: this.data.names,
        colors: ['#4454c3', '#c344ff', '#4ca5d9', '#f72d66', '#5ed94c'],
        chart: {
          type: 'pie',
          height: 350,
        },
        legend: {
          show: true,
          position: 'bottom',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 360,
                height: 350,
              },
              legend: {
                show: true,
                position: 'bottom',
              },
            },
          },
        ],
      };
    }
  }
}
