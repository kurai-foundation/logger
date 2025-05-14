import AbstractLogger from "./loggers/abstract/abstract-logger"
import BrowserLogger from "./loggers/browser-logger"
import { INamedLogger, LoggerConfiguration, SessionLogsStorage, StoredLog } from "./types"

export const LogsStorage: SessionLogsStorage = Array<StoredLog>()

const DefaultLoggers: {
  default?: AbstractLogger
  browser: AbstractLogger
  node?: AbstractLogger
} = {
  browser: new BrowserLogger({
    storage: LogsStorage
  })
}

export default class Logger {
  /**
   * Get browser logger instance
   */
  public static get browser() {
    return DefaultLoggers.browser
  }

  /**
   * Get node logger instance as AbstractLogger type
   * If not defined, runtime error will raise without typescript error due type assertion
   */
  public static get unsafeNode() {
    return DefaultLoggers.node as AbstractLogger
  }

  /**
   * Safely get node logger
   *
   * This method will require manual check for node logger to be defined
   */
  public static get node() {
    return DefaultLoggers.node
  }

  /**
   * Get named logger
   *
   * @param namespace
   */
  public static named(namespace: string): INamedLogger {
    return {
      /**
       * Signed info log
       * @param message log message
       */
      info: (...message: string[]) => this.infoFrom(namespace, ...message),
      warning: (...message: string[]) => this.warningFrom(namespace, ...message),
      /**
       * Signed error log
       * @param message log message
       */
      error: (...message: string[]) => this.errorFrom(namespace, ...message),
      /**
       * Signed success log
       * @param message log message
       */
      success: (...message: string[]) => this.successFrom(namespace, ...message),
    }
  }

  /**
   * Asynchronously import node logger and write it into memory
   *
   * @param config default configuration, optional
   */
  public static async setupNodeLogger(config?: LoggerConfiguration): Promise<void> {
    const NodeLogger = await import("./loggers/node-logger")

    DefaultLoggers.node = new NodeLogger.NodeLogger({
      storage: LogsStorage,
      ...config ?? {}
    })
  }

  /**
   * Changes default logger, used by Logger.* log methods
   *
   * Default is browser logger
   *
   * @param logger
   */
  public static setDefaultLogger(logger: AbstractLogger) {
    DefaultLoggers.default = logger
  }

  /**
   * Reconfigure all defined loggers
   *
   * @param config new configuration
   */
  public static reconfigure(config: LoggerConfiguration) {
    DefaultLoggers.node?.reconfigure(config)
    DefaultLoggers.browser.reconfigure(config)
    DefaultLoggers.default?.reconfigure(config)
  }

  /**
   * Anonymous informational log
   *
   * @param message log message
   */
  public static info(...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.info(...message)
  }

  /**
   * Signed informational log
   *
   * @param from sender
   * @param message log message
   */
  public static infoFrom(from: string, ...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.infoFrom(from, ...message)
  }

  /**
   * Anonymous warning log
   *
   * @param message log message
   */
  public static warning(...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.warning(...message)
  }

  /**
   * Signed warning log
   *
   * @param from sender
   * @param message log message
   */
  public static warningFrom(from: string, ...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.warningFrom(from, ...message)
  }

  /**
   * Anonymous error log
   *
   * @param message log message
   */
  public static error(...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.error(...message)
  }

  /**
   * Signed error log
   *
   * @param from sender
   * @param message log message
   */
  public static errorFrom(from: string, ...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.errorFrom(from, ...message)
  }

  /**
   * Anonymous success log
   *
   * @param message log message
   */
  public static success(...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.success(...message)
  }

  /**
   * Signed success log
   *
   * @param from sender
   * @param message log message
   */
  public static successFrom(from: string, ...message: any) {
    const logger = DefaultLoggers.default ?? DefaultLoggers.browser
    return logger.successFrom(from, ...message)
  }

  /**
   * Export stored logs
   */
  public static exportStoredLogs(): SessionLogsStorage {
    return JSON.parse(JSON.stringify(LogsStorage))
  }
}
