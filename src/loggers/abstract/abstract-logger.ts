import { LoggerConfiguration, LogLevel, PossibleInputs } from "../../types"

export default abstract class AbstractLogger {
  protected constructor(protected config: LoggerConfiguration) {
  }

  public reconfigure(config: Partial<LoggerConfiguration>) {
    this.config = { ...this.config, ...config }
    return this
  }

  public info(...message: any) {
    return this.log(LogLevel.INFO, message)
  }

  public infoFrom(from: string, ...message: any) {
    return this.log(LogLevel.INFO, message, from)
  }

  public warning(...message: any) {
    return this.log(LogLevel.WARNING, message)
  }

  public warningFrom(from: string, ...message: any) {
    return this.log(LogLevel.WARNING, message, from)
  }

  public error(...message: any) {
    return this.log(LogLevel.ERROR, message)
  }

  public errorFrom(from: string, ...message: any) {
    return this.log(LogLevel.ERROR, message, from)
  }

  public success(...message: any) {
    return this.log(LogLevel.SUCCESS, message)
  }

  public successFrom(from: string, ...message: any) {
    return this.log(LogLevel.SUCCESS, message, from)
  }

  public abstract log(logLevel: LogLevel, message: any[], from?: string): {
    set json(data: ((message: string) => PossibleInputs) | PossibleInputs)
  }

  protected getJsonResponse(message: any[], logLevel: LogLevel, from?: string) {
    const self = this
    return {
      set json(data: ((message: string) => PossibleInputs) | PossibleInputs | [string, PossibleInputs]) {
        self.jsonLog(typeof data === "function" ? data(message.map(m => typeof m === "object" ? JSON.stringify(m) : m).join(" ")) : data, logLevel, from)
      }
    }
  }

  protected jsonLog(message: PossibleInputs, level: LogLevel, module?: string) {
    if (!this.config.json) return

    let _module = module ?? "system"
    let _message: PossibleInputs | null | undefined = message
    let _level = level


    if (typeof message === "object" && "__module" in message) {
      const { __module, __level, ...rest } = message

      if (__module) _module = __module
      if (__level) _level = __level
      _message = rest
    }

    if (this.config.storage) this.config.storage.push({ level, timestamp: Date.now(), message: JSON.stringify(_message) })
    this.withMiddleware({
      module: _module ?? "system",
      level: _level,
      timestamp: Date.now(),
      data: typeof _message !== "object" ? { message: _message } : _message
    }, m => console.info(JSON.stringify(m)))
  }

  protected withMiddleware(message: any, onLog: (message: any) => void) {
    const _msg = () => {
      if (!this.config.middleware) return message

      return this.config.middleware(message)
    }

    onLog(_msg())
  }
}
