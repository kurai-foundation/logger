export function generateReadableTimestamp(attachDate?: boolean, attachTime?: boolean) {
  const date = new Date()
  const dateResponseArray: string[] = []

  if (attachDate) dateResponseArray.push([
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ].map(s => String(s).padStart(2, "0")).join("-"))

  if (attachTime) dateResponseArray.push([
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ].map(s => String(s).padStart(2, "0")).join(":"))

  return dateResponseArray.join(" ").trim().replace(/\s{2,}/g, " ")
}

export enum LogLevel {
  INFO = "Info",
  WARNING = "Warning",
  ERROR = "Error",
  SUCCESS = "Success"
}
