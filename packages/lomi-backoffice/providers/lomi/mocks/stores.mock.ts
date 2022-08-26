export const storesMock:any = {
    "25": {
        name : "Vicuña Mackenna Poniente 6690 local 30 - La Florida",
        county: "La Florida",
        value: 25
    },
    "1": {
        name: "Balmoral 309 local 217 - Las Condes",
        county: "Las Condes",
        value: 1
    },
    "24": {
        name: "Irarrázaval 200 local 107 - Ñuñoa",
        county: "Ñuñoa",
        value: 24
    },
    "28": {
        name: "Sewell 20, Local 3 - Machalí",
        county: "Rancagua",
        value: 28
    },
    "27": {
        name: "Av. Edmundo Eluchans 1737, Local 3 - Viña del Mar",
        value: 27,
        county: "Viña del Mar",
    }
}

export const storesMockAsArray = Object.values(storesMock).map((store:any)=>store.name)