// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const version = require("../../player/version.js").version;

export const environment = {
  production: false,
  vscode:false,
  server_url : "https://bevara.ddns.net",
  src:'https://bevara.ddns.net/test-signals/JXL/red-room.jxl',
  tags_version : version
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
