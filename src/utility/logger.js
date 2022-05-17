// Imports
import { createLogger, transports } from 'winston';
import * as logform from 'logform';
import nconf from 'nconf';
import path from 'path';

const { combine, timestamp, label, printf } = logform.format;
var logger = null;

export class LoggerUtility {

  getLoggerInstance () {

    if (logger) {

      return logger;

    }
    return this.init();

  }

  init () {

    try {

      const _winstonInstance = createLogger({
        level: nconf.get('WINSTON_FILE_LOG_LEVEL'),
        format: combine(
          label({ label: nconf.get('WINSTON_LABEL') }),
          timestamp(),
          printf((nfo) => {

            return `${nfo.timestamp} [${nfo.label}] ${nfo.level}: ${nfo.message}`;

          })
        ),
        transports: [
          new transports.Console({
            options: {
              level: nconf.get('WINSTON_CONSOLE_LOG_LEVEL')
            }
          }),
          new transports.File({
            filename: path.resolve('./logs/exceptions.log'),
            options: {
              handleExceptions: true,
              level: nconf.get('WINSTON_FILE_LOG_LEVEL')
            }
          })
        ],
        exitOnError: false
      });

      logger = _winstonInstance;
      return logger;

    } catch (error) {

      console.error(
        `LoggerUtility:init:: runtime error ocurred while initializing logger ${error} ${error.stack} ${JSON.stringify(error)}`
      );

    }

  }

}
