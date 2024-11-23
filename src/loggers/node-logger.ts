import colors from "colors/safe"
import { LoggerConfiguration, LogLevel } from "../types"
import AbstractLogger from "./abstract/abstract-logger"


export class NodeLogger extends AbstractLogger {
  constructor(config: LoggerConfiguration) {
    super(config)
  }

  protected log(logLevel: LogLevel, message: any[], from?: string) {
    colors.enable()

    const messageColor = {
      [LogLevel.WARNING]: "yellow",
      [LogLevel.ERROR]: "red",
      [LogLevel.INFO]: "cyan",
      [LogLevel.SUCCESS]: "green"
    }[logLevel]

    if (this.config.showPrefix === false) {
      console.log(...message)

      colors.disable()
      return
    }

    const fgColor = (msg: string) => (colors as any)[messageColor](msg) as string
    const bgColor = (msg: string) => (colors as any)["bg" + messageColor[0].toUpperCase() + messageColor.slice(1)](msg) as string

    const override = this.config.overrideMessageOutput
    const nextMessage = override ? override(logLevel, message, from) : [
      colors.grey(new Date().toISOString()),
      fgColor(logLevel),
      from ? bgColor(` ${ from } `) : "",
      ...message
    ].filter(Boolean)

    console.log(...nextMessage)

    this.config.storage?.[logLevel].push({
      timestamp: Date.now(),
      level: logLevel,
      message: JSON.stringify(nextMessage)
    })

    colors.disable()
  }
}
