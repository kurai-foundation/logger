import colors from "colors/safe"
import { LoggerConfiguration, SessionLogsStorage } from "../types"
import AbstractLogger from "./abstract-logger"
import { generateReadableTimestamp, LogLevel } from "../utils"


export class NodeLogger extends AbstractLogger {
  constructor(config: LoggerConfiguration, storage: SessionLogsStorage) {
    super(config, storage)
  }

  protected log(logLevel: LogLevel, message: any[], from?: string) {
    colors.enable()
    const colorsConfig = this.config.colors?.node

    const messageColor = {
      [LogLevel.WARNING]: colorsConfig?.Warning ?? "yellow",
      [LogLevel.ERROR]: colorsConfig?.Error ?? "red",
      [LogLevel.INFO]: colorsConfig?.Info ?? "cyan",
      [LogLevel.SUCCESS]: colorsConfig?.Success ?? "green"
    }[logLevel]

    if (this.config.showPrefix === false) {
      console.log(...message)

      colors.disable()
      return
    }

    const readableTimestamp = generateReadableTimestamp(this.config.attachPrefixTime, this.config.attachPrefixDate)

    const nextMessage = [
      (colors as any)[messageColor]?.(`[${ logLevel }${ from ? ` from ${ from }` : "" }${ readableTimestamp ? ` at ${ readableTimestamp }` : "" }]`.replace(/\s{2,}/g, "")),
      ...message
    ]

    console.log(...nextMessage)

    this.logsStorage[logLevel].push({
      timestamp: Date.now(),
      level: logLevel,
      message: JSON.stringify(nextMessage)
    })

    colors.disable()
  }
}
