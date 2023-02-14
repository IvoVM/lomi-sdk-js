function normalizePhone(phoneNumber, noPrefix = false){
    if(phoneNumber.startsWith("+")){
        return phoneNumber
    } else if(phoneNumber.startsWith("9") || phoneNumber.startsWith("2")  && phoneNumber.length == 9){
        return "+56" + phoneNumber
    } else if(phoneNumber.length == 11){
        return "+" + phoneNumber
    } else if(phoneNumber.length == 8){
        return "+569" + phoneNumber
    }
    return "+"+phoneNumber
}

module.exports = {
    normalizePhone
}