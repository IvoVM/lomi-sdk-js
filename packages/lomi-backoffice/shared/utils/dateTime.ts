export const UtilsTime = {
    getTimeDiff: (time: any) => {
        let timeNow = new Date().getTime()
        let mitunesNow = new Date().getMinutes()
        let hoursLeft = Math.trunc((time - timeNow) / 1000 / 3600)
        let minutesLeft = 60 - mitunesNow
        return {
            hoursLeft,
            minutesLeft: hoursLeft < 1 ? mitunesNow: minutesLeft
          }
    },

    getTotalTime: (time: any) => {
        time = new Date(time * 1000).getTime()
        let timeNow = new Date().getTime()
        let totalHours = Math.trunc((timeNow - time) / 1000 / 3600)
        return {
            totalHours
        }
    }
}