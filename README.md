# Logger

Logger with colored output for both node and web applications

## Table of contents

- [Environment-based setup](#environment-based-setup)
    - [Use logger with browser environment](#use-logger-with-browser-environment)
    - [Use logger with node environment](#use-logger-with-node-environment)
- [Configuring logger](#configuring-the-logger)
    - [Reconfiguring logger](#reconfiguring-logger)
    - [Named logger instance](#named-logger-instance)
- [Exporting stored logs](#exporting-stored-logs)
- [Available logging methods](#available-logging-methods)
- [License](#license)

## Environment-based setup

This section describes how to customize the logger to fit your environment.

### Use logger with browser environment

If you want to use the logger in a browser environment,
just call the static methods of the main class (`Logger`) because the browser
logger is always set by default

```ts
// my-store.ts
import Logger from "@kurai-io/logger"

Logger.infoFrom("MyModule", "Message from module")
```

You can also call `BrowserLogger` directly by accessing the main class getter

```ts
import Logger from "@kurai-io/logger"

Logger.browser.info("My message")
```

### Use logger with node environment

If you want to use the logger in a node environment,
you must first set up the node logger. The node logger
is not defined by default, as it may not work in a browser environment

```ts
import Logger from "@kurai-io/logger"

Logger.setupNodeLogger() // This is asynchronous function

```

You can also pass a configuration object directly to the setup function

```ts
import Logger from "@kurai-io/logger"

Logger.setupNodeLogger({
  // Configuration
})

// Once configured, you should be able to call the node logger

Logger.node?.info("My message")

// or

Logger.unsafeNode.info("My message")

```

## Configuring the logger

This section describes the process of customizing the logger to your needs

### Changing default logger

The default logger (`BrowserLogger`) will be
used by the logging methods of the main class (`Logger`).
You can change the default logger to determine which
logger will be used by the default logging methods

```ts
Logger.setDefaultLogger(Logger.browser)
// or
Logger.setDefaultLogger(Logger.unsafeNode)
```

_Note: you must configure the node logger before using the
logging methods, otherwise you will get an error at runtime_

### Reconfiguring logger

This method will reconfigure all defined loggers.

```ts
import Logger from "@kurai-io/logger"

Logger.reconfigure({
  /*
   * If set as false, log prefix will be completely hidden
   *
   * Default is true
   * */
  showPrefix: true,

  /* If set to true, log time will be attached into prefix */
  attachPrefixTime: true,

  /* If set to true, log date will be attached into prefix */
  attachPrefixDate: true,

  /* Define custom logs storage */
  storage: LogsStorage
})
```

If you only want to reconfigure a specific logger, call the same method on the
of the desired logger instance

```ts
import Logger from "@kurai-io/logger"

Logger.browser.reconfigure({
  // Configuration
})
```

### Named logger instance

If you plan to output many messages from a single component
of your application, you may want to get a named logger instance
to avoid constantly specifying namespace

```typescript
const logger = Logger.named("MyNamespace")

// Only info, warning, error and success methods are availble
logger.info("Hello world!") // => [Info from MyNamespace] Hello world!
```

## Exporting stored logs

You can access the logs you received throughout the session

```ts
import Logger from "@kurai-io/logger"

Logger.exportStoredLogs()
```

The method will return an object with keys equal to
the keys of the `LogLevel` enumeration,
each containing an array of StoredLog objects.

The `StoredLog` object will always contain the following keys:

- `message` - converted to string message
- `timestamp` - javascript unix timestamp (milliseconds)
- `level` - log level equal to `LogLevel` values

## Available logging methods

| Method                                         | Browser prefix color | Node prefix color |
|------------------------------------------------|----------------------|-------------------|
| `info(...message: any[])`                      | cornflowerblue       | cyan              |
| `infoFrom(from: string, message: any[])`       | cornflowerblue       | cyan              |
| `warning(...message: any[])`                   | orange               | yellow            |
| `warningFrom(from: string, ...message: any[])` | orange               | yellow            |
| `error(...message: any[])`                     | red                  | red               |
| `errorFrom(from: string, ...message: any[])`   | red                  | red               |

_Note: colors will not be used if the prefix is completely disabled_

_Note 2: only methods without the `From` postfix are available for the named logger_

## License

You can copy and paste the MIT license summary from below.

```text
MIT License

Copyright (c) 2022-2024 Kurai Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```
