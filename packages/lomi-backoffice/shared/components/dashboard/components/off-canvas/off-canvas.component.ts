// import { CommonModule } from '@angular/common';
// import {
//   Component,
//   TemplateRef,
//   OnInit,
//   Input,
//   ViewEncapsulation,
// } from '@angular/core';
// import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

// import { TopProductsTableComponent } from '../top-products/components/top-products-table/top-products-table.component';
// @Component({
//   selector: 'lomii-off-canvas',
//   standalone: true,
//   imports: [CommonModule, TopProductsTableComponent],
//   templateUrl: './off-canvas.component.html',
//   styleUrls: ['./off-canvas.component.scss'],
//   encapsulation: ViewEncapsulation.None,
// })
// export class OffCanvasComponent implements OnInit {
//   @Input() data: any;
//   lomi_logo =
//     'https://lomi.cl/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMThjQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bedcc2ae48446b27bfcd71352e6987e9ac5c9e14/logo.png';

//     constructor(private offcanvasService: NgbOffcanvas) {}

//   ngOnInit(): void {
//     this.data[0] = this.data[0].map((item: any) => {
//       return {
//         ...item,
//         name: this.truncateString(item.name, 25),
//       };
//     });
//   }
//   openEnd(content: TemplateRef<any>) {
// 		this.offcanvasService.open(content, { position: 'end' });
// 	}

//   truncateString(str: string, maxLength: number) {
//     if (str.length > maxLength) {
//       return str.substring(0, maxLength - 3) + '...';
//     } else {
//       return str;
//     }
//   }
// }
