# Lomi-sdk

This is our Lomi main library, it has abstractions of some of our commonly used flows

## Promotions endpoint
Access to Promotions V1 Endpoint flexible promotions

### Delivery promotions

Get all promotions avaible relationed to delivery and shipments

```Typescript
import { Promotions } from '@lomii/lomi-sdk'

Promotions.getPromotionsOfCart(cart.data.attributes).then((promotions)=>{
    /**
     * {
     *  currentDeliveryPromotion: Promotion | Null if not reachead one
     *  nextPromotion: Promotion | Null if current is last goal
     * }
     * **/
    doSomethingWithPromotions(promotions)
}) 

function doSomethingWithPromotions(promotions){
    console.log(`Actualmente tu carrito tiene la siguiente promocion activa : ${promotions.currentDeliveryPromotion.name}`);

    console.log(`Te faltan ${promotions.nextPromotion.amountToReach} pesos para alcanzar la siguiente meta`)

}
```

