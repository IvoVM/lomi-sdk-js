export const storesMock:any = {
    "25": {
        name : "Vicuña Mackenna Poniente 6690, La Florida",
        county: "La Florida",
        value: 25,
        notes: "Tienda LOMI - local 30, Piso 2"
    },
    "1": {
        name: "Balmoral 309, Las Condes",
        county: "Las Condes",
        value: 1,
        notes: "Tienda LOMI - local 217, Piso2"
    },
    "24": {
        name: "Irarrázaval 200, Ñuñoa",
        county: "Ñuñoa",
        value: 24,
        notes: "Tienda LOMI - local 107"
    },
    "28": {
        name: "Sewell 20, Machalí",
        county: "Rancagua",
        value: 28,
        notes: "Tienda LOMI - Local 3"
    },
    "27": {
        name: "Av. Edmundo Elchans 1737, Viña del Mar",
        value: 27,
        county: "Viña del Mar",
        notes: "Tienda LOMI - Local 3"
    },
    "39": {
        name: "Tienda los Angeles",
        value: 39,
        county: "Los Angeles",
        notes: ""
    }
}

export const storesMockAsArray = Object.values(storesMock).map((store:any)=>store.name)