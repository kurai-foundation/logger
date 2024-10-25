import { LogLevel } from "./utils"

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

  /** Custom output prefix colors */
  colors?: {
    node?: { [key in LogLevel]: string }
    browser?: { [key in LogLevel]: string }
  }
}

interface StoredLog {
  timestamp: number
  level: LogLevel
  message: string
}

export type SessionLogsStorage = { [key in LogLevel]: StoredLog[] }
