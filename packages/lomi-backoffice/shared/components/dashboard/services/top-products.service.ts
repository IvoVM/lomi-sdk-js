import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class topProductsService {
  // Top-Products Table
  countLineProducts(dataArray: any) {
    const itemData: { [key: string]: any } = {};
    dataArray.forEach((item: any) => {
      if (item.shipments && item.shipments.length > 0) {
        const lineItems = item.shipments[0].line_items;
        if (lineItems) {
          lineItems.forEach((lineItem: any) => {
            const itemName = lineItem.name;
            const quantity = lineItem.quantity;
            // Si es la primera vez que encontramos este nombre, se inicializa como un objeto
            if (!itemData[itemName]) {
              itemData[itemName] = { name: itemName, count: 0, ...lineItem };
            }
            // Suma por la cantidad
            itemData[itemName].count += quantity;
          });
        }
      }
    });
    return itemData;
  }

  getTopProducts(itemData: any, n: any) {
    const sortedItems = Object.keys(itemData).sort(
      (a, b) => itemData[b].count - itemData[a].count
    );
    return sortedItems.slice(0, n).map((itemName) => itemData[itemName]);
  }

  // Top-Products Graphic
  calcularPorcentajes(productos: any[]): {
    porcentajes: number[];
    names: string[];
  } {
    const total = productos.reduce((sum, producto) => sum + producto.count, 0);
    productos.forEach((producto) => {
      producto.porcentaje = (producto.count / total) * 100;
    });

    return this.dividirValores(productos);
  }

  dividirValores(productos: any[]): { porcentajes: number[]; names: string[] } {
    const porcentajes: number[] = [];
    const names: string[] = [];

    productos.forEach((producto) => {
      porcentajes.push(producto.porcentaje);
      names.push(producto.name);
    });

    return { porcentajes, names };
  }
}
