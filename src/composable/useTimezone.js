import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

export default function () {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const getTimeWithTimezone = (date) => {
    return dayjs.tz(dayjs.utc(date), 'Europe/London').tz(timeZone)
  }
  return { getTimeWithTimezone }
}
