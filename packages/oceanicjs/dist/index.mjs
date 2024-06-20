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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/client.ts
import {
  Discolytics as CoreClient,
  ClientType
} from "@discolytics/core";
import fs from "fs";
import path from "path";
var Discolytics = class {
  constructor(data) {
    var _a;
    if (!data.bot.options.auth)
      throw new Error("Auth not passed to OceanicJS client");
    this.core = new CoreClient(__spreadProps(__spreadValues({}, data), {
      clientType: ClientType.OCEANIC_JS,
      auth: data.bot.options.auth,
      clientVersion: this.getClientVersion()
    }));
    this.bot = data.bot;
    this.autoPostShards = (_a = data.autoPostShards) != null ? _a : true;
    this.postShards = this.core.postShards.bind(this.core);
    this.postCluster = this.core.postCluster.bind(this.core);
    if (this.autoPostShards) {
      setInterval(() => {
        this.postShards(
          this.bot.shards.map((shard) => ({
            id: shard.id,
            status: this.mapShardStatus(shard.status),
            latency: shard.latency
          }))
        );
      }, 1e3 * 15);
    }
    this.bot.on("packet", (data2) => __async(this, null, function* () {
      const d = data2.d;
      this.core.sendEvent(data2.t, d == null ? void 0 : d.guild_id);
      if (data2.t === "INTERACTION_CREATE" && (d == null ? void 0 : d.type)) {
        this.core.postInteraction(d.type, d.guild_id);
      }
    }));
  }
  mapShardStatus(status) {
    switch (status) {
      case "connecting":
        return "connecting";
      case "ready":
        return "ready";
      case "resuming":
        return "resuming";
      default:
        return "disconnected";
    }
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
