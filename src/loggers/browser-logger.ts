import AbstractLogger from "./abstract/abstract-logger"
import { LoggerConfiguration } from "../types"
import { generateReadableTimestamp, LogLevel } from "../utils"

export default class BrowserLogger extends AbstractLogger {
  constructor(config: LoggerConfiguration) {
    super(config)
  }

  protected log(logLevel: LogLevel, message: any[], from?: string) {
    const colorsConfig = this.config.colors?.browser

    const messageColor = {
      [LogLevel.WARNING]: colorsConfig?.Warning ?? "orange",
      [LogLevel.ERROR]: colorsConfig?.Error ?? "red",
      [LogLevel.INFO]: colorsConfig?.Info ?? "cornflowerblue",
      [LogLevel.SUCCESS]: colorsConfig?.Success ?? "green"
    }[logLevel]

    if (this.config.showPrefix === false) {
      console.log(...message)
      return
    }

    const readableTimestamp = generateReadableTimestamp(this.config.attachPrefixDate, this.config.attachPrefixTime)

    const nextMessage = [
      `\n%c[${ logLevel }${ from ? ` from ${ from }` : "" }${ readableTimestamp ? ` at ${ readableTimestamp }` : "" }]`.replace(/\s{2,}/g, ""),
      `color:${ messageColor }`,
      ...message,
      "\n\n"
    ]

    console.log(...nextMessage)

    this.config.storage?.[logLevel].push({
      timestamp: Date.now(),
      level: logLevel,
      message: JSON.stringify(nextMessage)
    })
  }
}
