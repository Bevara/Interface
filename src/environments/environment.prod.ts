const version = require("../../player/version.js").version;
const build = require("../../player/version.js").build;

export const environment = {
  production: true,
  vscode:false,
  server_url : "https://bevara.ddns.net",
  accessor_version : build,
  src:'https://bevara.ddns.net/test-signals/JXL/red-room.jxl',
  tags_version : version
};
