export const storesMock:any = {
    "25": {
        name : "Vicuña Mackenna Poniente 6690 local 30 - La Florida",
        county: "La Florida",
        value: 25,
        notes: "Tienda LOMI - Piso 2"
    },
    "1": {
        name: "Balmoral 309 local 217 - Las Condes",
        county: "Las Condes",
        value: 1,
        notes: "Tienda LOMI - Piso 2"
    },
    "24": {
        name: "Irarrázaval 200 local 107 - Ñuñoa",
        county: "Ñuñoa",
        value: 24,
        notes: "Tienda LOMI"
    },
    "28": {
        name: "Sewell 20, Local 3 - Machalí",
        county: "Rancagua",
        value: 28,
        notes: ""
    },
    "27": {
        name: "Av. Edmundo Eluchans 1737, Local 3 - Viña del Mar",
        value: 27,
        county: "Viña del Mar",
        notes: "Tienda LOMI"
    }
}

export const storesMockAsArray = Object.values(storesMock).map((store:any)=>store.name)