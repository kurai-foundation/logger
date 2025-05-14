export enum LogLevel {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success"
}

export type PossibleInputs = ({ [key: string]: any } & { __module?: string, __level?: LogLevel }) | Array<any> | string | number | boolean

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

  /**
   * Set true to enable json logs mode
   *
   * _Note that in json mode, all logs that have no json description will be suppressed_
   *
   * @default false
   */
  json?: boolean

  /**
   * Calls each time before log will be serialized and sent
   *
   * Return null to suppress log
   */
  middleware?<T = any>(message: T): T | null | undefined

  /** If set to true, log time will be attached into the prefix */
  attachPrefixTime?: boolean

  /** If set to true, log date will be attached into the prefix */
  attachPrefixDate?: boolean

  /** Logs storage */
  storage?: SessionLogsStorage

  /**
   * Override message output. Has no influence on json logs
   */
  overrideMessageOutput?(level: LogLevel, message: any[], from?: string): string[]
}

export interface StoredLog {
  timestamp: number
  level: LogLevel
  message: string
}

export type SessionLogsStorage = { push: (content: StoredLog) => void }
