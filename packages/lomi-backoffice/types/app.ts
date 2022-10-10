import { Resource } from "./resources";
import { UserPrivelege, UserRol } from "./user";

export type App = {
    userPrivileges: UserPrivelege[];
    userRols: UserRol[];
    resources: Resource[];

    selectedStockLocationId: number;
}
