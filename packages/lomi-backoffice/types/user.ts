export type IUser = {
    uid:         string;
    displayName?: string;
    userRol: number | UserRol;
    email: string;
    loading?:    boolean;
    error?:      string;
}

export type UserRol = {
    id: number;
    rolName: string;
    userPrivileges: number[];
    stockLocationId?: number;
}

export type UserPrivelege = {
    privilegeName: string;
    collectionNames: string[]
    read?: boolean
    write?: boolean
    delete?: boolean
}

export class User {
    constructor(public uid: string, public displayName: string) {}
}