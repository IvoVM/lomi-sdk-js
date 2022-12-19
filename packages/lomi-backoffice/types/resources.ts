export type DefaultResource = {
    id: string;
    type: string;
    name: string,
    stockLocationId?: string;
}

export type SpreeStockLocationResource = DefaultResource & {
    name: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    country: string;
    notes: string;
}

export type Resource = SpreeStockLocationResource | DefaultResource