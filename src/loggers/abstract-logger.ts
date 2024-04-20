import { LoggerConfiguration, SessionLogsStorage } from "../types"
import { LogLevel } from "../utils"

export default abstract class AbstractLogger {
  protected constructor(protected config: LoggerConfiguration, protected logsStorage: SessionLogsStorage) {
  }

  public reconfigure(config: LoggerConfiguration) {
    this.config = config
  }

  public info(...message: any) {
    this.log(LogLevel.INFO, message)
  }

  public infoFrom(from: string, ...message: any) {
    this.log(LogLevel.INFO, message, from)
  }

  public warning(...message: any) {
    this.log(LogLevel.WARNING, message)
  }

  public warningFrom(from: string, ...message: any) {
    this.log(LogLevel.WARNING, message, from)
  }

  public error(...message: any) {
    this.log(LogLevel.ERROR, message)
  }

  public errorFrom(from: string, ...message: any) {
    this.log(LogLevel.ERROR, message, from)
  }

  public success(...message: any) {
    this.log(LogLevel.SUCCESS, message)
  }

  public successFrom(from: string, ...message: any) {
    this.log(LogLevel.SUCCESS, message, from)
  }

  protected abstract log(logLevel: LogLevel, message: any[], from?: string): void
}
