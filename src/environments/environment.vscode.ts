const version = require("../../player/version.js").version;
const build = require("../../player/version.js").build;

export const environment = {
  production: false,
  vscode:true,
  server_url : "https://bevara.ddns.net",
  accessor_version : build,
  src:'',
  tags_version : version
};
