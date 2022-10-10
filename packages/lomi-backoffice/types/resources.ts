export type DefaultResource = {
    id: string;
    type: string;
    name: string,
}

export type SpreeStockLocationResource = DefaultResource & {
    id: number;
}

export type Resource = DefaultResource | SpreeStockLocationResource