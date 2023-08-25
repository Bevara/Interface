import { Injectable } from '@angular/core';

export type Log = 'graph' | 'stats' | 'report' | 'logs';
export type LogLevel = 'quiet' | 'error' | 'warning' | 'info'| 'debug';
export const AllLogLevel: LogLevel[] = ['quiet' , 'error' , 'warning' , 'info', 'debug'];

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private _logs: Log[] = [];
  private _logLevel: LogLevel = 'warning';
  constructor() { }

  hasLog(log: Log) {
    return this._logs.indexOf(log) !== -1;
  }

  toogleLog(log: Log) {
    const index = this._logs.indexOf(log);

    if (index === -1) {
      this._logs.push(log);
    } else {
      this._logs.splice(index, 1);
    }
  }

  get logs() {
    return this._logs;
  }

  get logLevel() {
    return this._logLevel;
  }
  
  set logLevel(level: LogLevel) {
    this._logLevel = level;
  }

  get allLogLevel() : LogLevel[] {
    return AllLogLevel;
  }

  get logsStr(): string {
    return this._logs.map(x => x == 'logs' ? 'logs="all@' + this._logLevel + "\"" : x).join(" ");
  }
}
