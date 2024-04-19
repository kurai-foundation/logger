import { LogLevel } from "./utils"

export interface LoggerConfiguration {
  /**
   * If set as false, log prefix will be completely hidden
   *
   * Default is true
   * */
  showPrefix?: boolean

  /** If set to true, log time will be attached into prefix */
  attachPrefixTime?: boolean

  /** If set to true, log date will be attached into prefix */
  attachPrefixDate?: boolean
}

interface StoredLog {
  timestamp: number
  level: LogLevel
  message: string
}

export type SessionLogsStorage = { [key in LogLevel]: StoredLog[] }
