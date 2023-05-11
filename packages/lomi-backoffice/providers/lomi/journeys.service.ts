import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { collectionData, Firestore } from "@angular/fire/firestore";
import { collection, query, where } from "firebase/firestore";

@Injectable()
export class JourneysService {

    public selectJourneysFromFirebaseByOrderId(orderId:string){
        const journeysCollection = collection(this.afs,`deliveringJourneys/`)
        const journeysQuery = query(journeysCollection,
            where("orderNumber", "==" , orderId),
            )
        return collectionData(journeysQuery)
    }

    public selectJourneysFromFirebase(){
        const journeysCollection = collection(this.afs,"deliveringJourneys/")
        const journeys = collectionData(journeysCollection)
        return journeys
    }

    public cancelJourney(id:number, providerId:number){
        if(providerId == 2){
            this.http.post("https://us-central1-lomi-35ab6.cloudfunctions.net/cancelHmxTrip",{})
        }
        return
    }



    constructor(private afs: Firestore, private http: HttpClient){
        return
    }
}