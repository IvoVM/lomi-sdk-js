function normalizePhone(phoneNumber, noPrefix = false){
    if(phoneNumber.startsWith("+")){
        return phoneNumber
    } else if(phoneNumber.startsWith("9") && phoneNumber.length == 9){
        return "+56" + phoneNumber
    } else if(phoneNumber.length == 11){
        return "+" + phoneNumber
    }
}

module.exports = {
    normalizePhone
}