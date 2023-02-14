module.exports = (()=>{

    const logisticProviders = {
        UBER: {
            providerId: 1,
            spreeProviderId: 3,
            name: "Uber"
        },
        CABIFY : {
            providerId: 3,
            spreeProviderId: 4,
            name: "Cabify"
        },
        HMX: {
            providerId: 2,
            spreeProviderId: 12,
            name: "Hermex"
        }
    }

    function providerIdToName(providerId){
        return Object.values(logisticProviders).find(provider => provider.providerId == providerId).name
    }

    function spreeProviderIdToNormalProviderId(spreeProviderId){
        return Object.values(logisticProviders).find(provider => provider.spreeProviderId == spreeProviderId).providerId
    }

    function normalProviderIdToSpreeProviderId(providerId){
        const provider = Object.values(logisticProviders).find(provider => provider.providerId == providerId)
        console.log("Provider is", provider)
        return provider.spreeProviderId
    }

    return {
        providerIdToName,
        spreeProviderIdToNormalProviderId,
        normalProviderIdToSpreeProviderId
    }

})()