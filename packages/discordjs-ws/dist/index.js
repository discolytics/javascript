"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Discolytics: () => Discolytics
});
module.exports = __toCommonJS(src_exports);

// src/client.ts
var import_core = require("@discolytics/core");
var import_ws = require("@discordjs/ws");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));

// src/utils.ts
var parseToken = (s) => {
  if (s.startsWith("Bot"))
    return s;
  return `Bot ${s}`;
};

// src/client.ts
var Discolytics = class {
  constructor(data) {
    var _a, _b;
    this.token = (_b = (_a = data.token) != null ? _a : data.manager.options.token) != null ? _b : "";
    if (!this.token)
      throw new Error("Auth not passed to DiscordJS WS Manager");
    this.token = parseToken(this.token);
    this.core = new import_core.Discolytics(__spreadProps(__spreadValues({}, data), {
      clientType: import_core.ClientType.DISCORDJS_WS,
      auth: this.token,
      clientVersion: this.getClientVersion()
    }));
    this.manager = data.manager;
    this.manager.on(import_ws.WebSocketShardEvents.Dispatch, (event) => {
      const d = event.data.d;
      this.core.sendEvent(event.data.t, d == null ? void 0 : d.guild_id);
      if (event.data.t === "INTERACTION_CREATE" && (d == null ? void 0 : d.type)) {
        this.core.postInteraction(d.type, d.guild_id);
      }
    });
    this.postShards = this.core.postShards.bind(this.core);
    this.postCluster = this.core.postCluster.bind(this.core);
  }
  startCommand(data) {
    return this.core.startCommand(data);
  }
  getClientVersion() {
    var _a;
    try {
      const json = JSON.parse(
        import_fs.default.readFileSync(import_path.default.join(__dirname, "..", "package.json"), "utf8")
      );
      return (_a = json == null ? void 0 : json.version) != null ? _a : void 0;
    } catch (e) {
      return void 0;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Discolytics
});
