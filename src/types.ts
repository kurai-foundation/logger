export enum LogLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS"
}

export interface INamedLogger {
  info(...message: string[]): void

  warning(...message: string[]): void

  success(...message: string[]): void

  error(...message: string[]): void
}

export interface LoggerConfiguration {
  /**
   * If set as false, the log prefix will be completely hidden
   *
   * Default is true
   * */
  showPrefix?: boolean

  /** If set to true, log time will be attached into the prefix */
  attachPrefixTime?: boolean

  /** If set to true, log date will be attached into the prefix */
  attachPrefixDate?: boolean

  storage: SessionLogsStorage

  overrideMessageOutput?(level: LogLevel, message: any[], from?: string): string[]
}

interface StoredLog {
  timestamp: number
  level: LogLevel
  message: string
}

export type SessionLogsStorage = { [key in LogLevel]: StoredLog[] }
