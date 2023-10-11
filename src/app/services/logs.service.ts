import { Injectable } from '@angular/core';

export type Log = 'graph' | 'stats' | 'report' | 'logs';
export type LogLevel = 'quiet' | 'error' | 'warning' | 'info'| 'debug';
export type LogTool = 'all' | 'codec' | 'container' | 'filter'| 'core';
export const AllLogLevel: LogLevel[] = ['quiet' , 'error' , 'warning' , 'info', 'debug'];
export const AllLogTool: LogTool[] = ['all' , 'codec' , 'container' , 'filter', 'core'];

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private _logs: Log[] = [];
  private _logLevel: LogLevel = 'debug';
  private _logTool: LogTool = 'filter';

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

  get logTool() {
    return this._logTool;
  }
  
  set logTool(tool: LogTool) {
    this._logTool = tool;
  }

  get allLogLevel() : LogLevel[] {
    return AllLogLevel;
  }

  get allLogTool() : LogTool[] {
    return AllLogTool;
  }

  get logsStr(): string {
    return this._logs.map(x => x == 'logs' ? 'logs="'+this._logTool+'@' + this._logLevel + "\"" : x).join(" ");
  }
}
