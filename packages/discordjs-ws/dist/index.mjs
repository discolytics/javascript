var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/client.ts
import {
  Discolytics as CoreClient,
  ClientType
} from "@discolytics/core";
import { WebSocketShardEvents } from "@discordjs/ws";
import fs from "fs";
import path from "path";

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
    this.core = new CoreClient(__spreadProps(__spreadValues({}, data), {
      clientType: ClientType.DISCORDJS_WS,
      auth: this.token,
      clientVersion: this.getClientVersion()
    }));
    this.manager = data.manager;
    this.manager.on(WebSocketShardEvents.Dispatch, (event) => {
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
        fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
      );
      return (_a = json == null ? void 0 : json.version) != null ? _a : void 0;
    } catch (e) {
      return void 0;
    }
  }
};
export {
  Discolytics
};
