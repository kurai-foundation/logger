import colors from "colors/safe"
import { LoggerConfiguration, LogLevel } from "../types"
import AbstractLogger from "./abstract/abstract-logger"


export class NodeLogger extends AbstractLogger {
  constructor(config: LoggerConfiguration) {
    super(config)
  }

  public log(logLevel: LogLevel, message: any[], from?: string) {
    const rv = this.getJsonResponse(message, logLevel, from)
    if (this.config.json) return rv

    colors.enable()

    const messageColor = {
      [LogLevel.WARNING]: "yellow",
      [LogLevel.ERROR]: "red",
      [LogLevel.INFO]: "cyan",
      [LogLevel.SUCCESS]: "green"
    }[logLevel]

    if (this.config.showPrefix === false) {
      this.withMiddleware(message, m => console.log(...m))

      colors.disable()
      return rv
    }

    const fgColor = (msg: string) => (colors as any)[messageColor](msg) as string
    const bgColor = (msg: string) => (colors as any)["bg" + messageColor[0].toUpperCase() + messageColor.slice(1)](msg) as string

    const override = this.config.overrideMessageOutput
    const nextMessage = override ? override(logLevel, message, from) : [
      colors.grey(new Date().toISOString()),
      fgColor(logLevel.toUpperCase()),
      from ? bgColor(` ${ from } `) : "",
      ...message
    ].filter(Boolean)

    this.withMiddleware(nextMessage, m => console.log(...m))

    this.config.storage?.push({
      timestamp: Date.now(),
      level: logLevel,
      message: message.map(i => typeof i === "object" ? JSON.stringify(i) : i).join(" ")
    })

    colors.disable()

    return rv
  }
}
