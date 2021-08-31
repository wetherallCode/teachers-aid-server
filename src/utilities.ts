export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}
export const timeAFunction = (startTime: string, endTime: string) => {
  const startTimeMinutes = +startTime
    .split('')
    .slice(startTime.length - 10, startTime.length - 8)
    .join('')
  const startTimeSeconds = +startTime
    .split('')
    .slice(startTime.length - 7, startTime.length - 1)
    .join('')
  const endTimeMinutes = +endTime
    .split('')
    .slice(endTime.length - 10, endTime.length - 8)
    .join('')
  const endTimeSeconds = +endTime
    .split('')
    .slice(endTime.length - 7, endTime.length - 1)
    .join('')
  return endTimeMinutes - startTimeMinutes === 0
    ? endTimeSeconds - startTimeSeconds
    : endTimeSeconds -
        startTimeSeconds +
        (60 * endTimeMinutes - startTimeMinutes)
}
