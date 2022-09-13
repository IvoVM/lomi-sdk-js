import { Injectable } from "@angular/core";
import { collectionData, Firestore } from "@angular/fire/firestore";
import { collection, query, where } from "firebase/firestore";

@Injectable()
export class JourneysService {

    public selectJourneysFromFirebaseByOrderId(orderId:string){
        const journeysCollection = collection(this.afs,`deliveringJourneys/`)
        const journeys = collectionData(journeysCollection)
        const journeysQuery = query(journeysCollection,
            where("orderNumber", "==" , orderId)
            )
        return journeys
    }

    public selectJourneysFromFirebase(id:number){
        const journeysCollection = collection(this.afs,"deliveringJourneys/")
        const journeys = collectionData(journeysCollection)
        const journeysQuery = query(journeysCollection)
        return journeys
    }

    public cancelJourney(id:number, providerId:number){
        return
    }



    constructor(private afs: Firestore){
        return
    }
}