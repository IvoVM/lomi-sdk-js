import { UserPrivelege, UserRol } from "./user";

export type App = {
    userPrivileges: UserPrivelege[];
    userRols: UserRol[];

    selectedStockLocationId: number;
}