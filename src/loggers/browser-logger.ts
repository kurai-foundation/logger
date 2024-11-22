import AbstractLogger from "./abstract/abstract-logger"
import { LoggerConfiguration, LogLevel } from "../types"

export default class BrowserLogger extends AbstractLogger {
  constructor(config: LoggerConfiguration) {
    super(config)
  }

  protected log(logLevel: LogLevel, message: any[], from?: string) {
    const messageColor = {
      [LogLevel.WARNING]: [ "orange", "black" ],
      [LogLevel.ERROR]: [ "red", "white" ],
      [LogLevel.INFO]: [ "cornflowerblue", "black" ],
      [LogLevel.SUCCESS]: [ "green", "white" ]
    }[logLevel]

    if (this.config.showPrefix === false) {
      console.log(...message)
      return
    }

    const datePrefix = new Date().toLocaleDateString("en-US")
    const timePrefix = new Date().toLocaleTimeString("en-US", { hour12: false })
    const combinedPrefix = new Date().toISOString()

    const prefix = Boolean(this.config.attachPrefixDate && this.config.attachPrefixTime)
      ? combinedPrefix
      : this.config.attachPrefixDate ? datePrefix
        : this.config.attachPrefixTime ? timePrefix
          : undefined

    const override = this.config.overrideMessageOutput
    const nextMessage = override ? override(logLevel, message, from) : [
      [
        prefix ? `%c${ prefix }` : "",
        `%c${ logLevel }`,
        from ? `%c ${ from } ` : "",
        "%c",
        ...message
      ].filter(Boolean).join(" ").replace(/\s{2,}/g, " ").trim(),
      prefix ? "color: gray" : "",
      `color: ${ messageColor[0] }`,
      from ? `color: ${ messageColor[1] }; background: ${ messageColor[0] }` : "",
      "color: unset"
    ].filter(Boolean)

    console.log(...nextMessage)

    this.config.storage?.[logLevel].push({
      timestamp: Date.now(),
      level: logLevel,
      message: JSON.stringify(nextMessage)
    })
  }
}
