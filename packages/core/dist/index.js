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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  API_URL: () => API_URL,
  ClientType: () => ClientType,
  DATA_API_URL: () => DATA_API_URL,
  DISCORD_API_URL: () => DISCORD_API_URL,
  Discolytics: () => Discolytics
});
module.exports = __toCommonJS(src_exports);

// src/core.ts
var import_node_fetch = __toESM(require("node-fetch"));

// src/constants.ts
var DATA_API_URL = "https://data.discolytics.com/api";
var API_URL = "https://api.discolytics.com/api";
var DISCORD_API_URL = "https://discord.com/api/v10";
var ClientType = /* @__PURE__ */ ((ClientType2) => {
  ClientType2[ClientType2["UNKNOWN"] = 0] = "UNKNOWN";
  ClientType2[ClientType2["DISCORD_JS"] = 1] = "DISCORD_JS";
  ClientType2[ClientType2["ERIS"] = 2] = "ERIS";
  ClientType2[ClientType2["OCEANIC_JS"] = 3] = "OCEANIC_JS";
  ClientType2[ClientType2["PYCORE"] = 4] = "PYCORE";
  ClientType2[ClientType2["DISCORDJS_WS"] = 5] = "DISCORDJS_WS";
  return ClientType2;
})(ClientType || {});

// src/core.ts
var parseAuth = (s) => {
  if (s.startsWith("Bot"))
    return s;
  return `Bot ${s}`;
};
var Discolytics = class {
  constructor(data) {
    var _a, _b, _c;
    this.botId = data.botId;
    this.apiKey = data.apiKey;
    this.clientType = (_a = data.clientType) != null ? _a : 0 /* UNKNOWN */;
    this.clientVersion = data.clientVersion;
    this.dataApiUrl = (_b = data.dataApiUrl) != null ? _b : DATA_API_URL;
    this.apiUrl = (_c = data.apiUrl) != null ? _c : API_URL;
    this.auth = parseAuth(data.auth);
    this.logLevels = {
      debug: false,
      error: true,
      info: true
    };
    this.pendingEvents = [];
    this.pendingInteractions = [];
    this.pendingCommands = [];
    this.clusterId = data.clusterId;
    setInterval(() => {
      this.postEvents();
      this.postInteractions();
      this.postCommands();
    }, 1e3 * 15);
    this.patchBot({});
    this.getBot();
    this.log("info", "Client ready");
  }
  isCluster() {
    return this.clusterId != null;
  }
  postShards(shards) {
    return __async(this, null, function* () {
      if (this.isCluster())
        return this.postCluster(shards);
      const res = yield (0, import_node_fetch.default)(`${this.dataApiUrl}/bots/${this.botId}/shards`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiKey
        },
        method: "PUT",
        body: JSON.stringify({
          shards
        })
      }).catch(() => null);
      if (!res) {
        this.log("error", "Failed to post shards");
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log("error", `Post shards returned status code : ${res.status}`);
      else
        this.log("debug", `Posted shards (${shards.length})`);
      return { success };
    });
  }
  postCluster(shards) {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(
        `${this.dataApiUrl}/bots/${this.botId}/clusters/${this.clusterId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.apiKey
          },
          method: "PUT",
          body: JSON.stringify({
            shards
          })
        }
      ).catch(() => null);
      if (!res) {
        this.log("error", "Failed to post cluster");
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log("error", `Post cluster returned status code : ${res.status}`);
      else
        this.log(
          "debug",
          `Posted cluster ${this.clusterId} with ${shards.length} shards`
        );
      return { success };
    });
  }
  log(level, ...args) {
    if (this.logLevels[level]) {
      switch (level) {
        case "debug":
          console.debug(/* @__PURE__ */ new Date(), " | Discolytics | ", ...args);
          break;
        case "error":
          console.error(/* @__PURE__ */ new Date(), " | Discolytics | ", ...args);
          break;
        case "info":
          console.log(/* @__PURE__ */ new Date(), " | Discolytics | ", ...args);
          break;
      }
    }
  }
  getBot() {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${this.apiUrl}/bots/${this.botId}`, {
        headers: {
          Authorization: this.apiKey
        }
      }).catch(() => null);
      if (!res) {
        this.log("error", "No response on get bot");
        return { success: false, data: null };
      }
      const data = yield res.json();
      const updateProfile = !data.profileLastUpdated || Date.now() - data.profileLastUpdated > 1e3 * 60 * 60 * 24;
      if (updateProfile) {
        const user = yield this.getBotUser();
        if (user) {
          const { success } = yield this.patchBot({
            botUserId: user.id,
            botUserName: user.username,
            botUserAvatar: this.getAvatarUrl(user)
          });
          if (success)
            this.log("info", "Updated bot profile");
          else
            this.log("error", "Failed to update bot profile");
        }
      }
      return { success: true, data };
    });
  }
  patchBot(data) {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${this.apiUrl}/bots/${this.botId}`, {
        headers: {
          Authorization: this.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(__spreadProps(__spreadValues({}, data), {
          clientType: this.clientType,
          clientVersion: this.clientVersion
        })),
        method: "PATCH"
      }).catch(() => null);
      if (!res) {
        this.log("error", "Failed to patch bot");
        return { success: false };
      }
      return { success: res.status >= 200 && res.status < 300 };
    });
  }
  postEvents() {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${this.dataApiUrl}/bots/${this.botId}/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiKey
        },
        method: "POST",
        body: JSON.stringify({
          events: this.pendingEvents
        })
      }).catch(() => null);
      const len = this.pendingEvents.length;
      this.pendingEvents = [];
      if (!res) {
        this.log("error", `Failed to post ${len} events`);
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log(
          "error",
          `Post events (${len}) returned status code : ` + res.status
        );
      else
        this.log("debug", `Posted ${len} events`);
      return { success };
    });
  }
  /**
   * Adds an event to the queue. The queue is posted to Discolytics every 15 seconds.
   */
  sendEvent(name, guildId) {
    this.pendingEvents.push({ name, guildId });
    this.log("debug", `Added event to queue : ${name} (Guild ID: ${guildId})`);
  }
  postInteractions() {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(
        `${this.dataApiUrl}/bots/${this.botId}/interactions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.apiKey
          },
          method: "POST",
          body: JSON.stringify({
            interactions: this.pendingInteractions
          })
        }
      ).catch(() => null);
      const len = this.pendingInteractions.length;
      this.pendingInteractions = [];
      if (!res) {
        this.log("error", `Failed to post ${len} interactions`);
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log(
          "error",
          `Post interactions (${len}) returned status code : ${res.status}`
        );
      else
        this.log("debug", `Posted ${len} interactions`);
      return { success };
    });
  }
  /**
   * Adds an interaction to the queue. The queue is posted to Discolytics every 15 seconds.
   */
  postInteraction(type, guildId) {
    this.pendingInteractions.push({ type, guildId });
    this.log(
      "debug",
      `Added interaction to queue : ${type} (Guild ID: ${guildId})`
    );
  }
  postCpuUsage(value) {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${this.dataApiUrl}/bots/${this.botId}/cpuUsage`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiKey
        },
        method: "POST",
        body: JSON.stringify({
          value,
          clientType: this.clientType
        })
      }).catch(() => null);
      if (!res) {
        this.log("error", "Failed to post CPU usage : " + value);
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log("error", "Post CPU usage returned status : " + res.status);
      return { success };
    });
  }
  postMemUsage(value) {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${this.dataApiUrl}/bots/${this.botId}/memUsage`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiKey
        },
        method: "POST",
        body: JSON.stringify({
          value,
          clientType: this.clientType
        })
      }).catch(() => null);
      if (!res) {
        this.log("error", "Failed to post memory usage : " + value);
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log("error", "Post memory usage returned status : " + res.status);
      return { success };
    });
  }
  startCommand(name, userId) {
    const start = Date.now();
    return {
      end: (metadata) => {
        const end = Date.now();
        const duration = end - start;
        return this.postCommand(name, userId, duration, metadata);
      }
    };
  }
  postCommands() {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${this.dataApiUrl}/bots/${this.botId}/commands`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiKey
        },
        method: "POST",
        body: JSON.stringify({
          commands: this.pendingCommands
        })
      }).catch(() => null);
      const len = this.pendingCommands.length;
      this.pendingCommands = [];
      if (!res) {
        this.log("error", `Failed to post ${len} commands`);
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log(
          "error",
          `Post commands (${len}) returned status code : ${res.status}`
        );
      else
        this.log("debug", `Posted ${len} commands`);
      return { success };
    });
  }
  postCommand(name, userId, duration, metadata) {
    this.pendingCommands.push({ name, userId, duration, metadata });
    this.log("debug", `Added command to queue : ${name} (User ID: ${userId})`);
  }
  getBotUser() {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${DISCORD_API_URL}/users/@me`, {
        headers: {
          Authorization: this.auth
        }
      }).catch(() => null);
      if (!res) {
        this.log("error", "Failed to get bot user");
        return;
      }
      const data = yield res.json();
      return data;
    });
  }
  getAvatarUrl(user) {
    if (!user.avatar) {
      const index = user.discriminator === "0" ? Number(BigInt(user.id) >> BigInt(22)) % 6 : Number(user.discriminator) % 5;
      return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
  sendHeartbeat() {
    return __async(this, null, function* () {
      const res = yield (0, import_node_fetch.default)(`${this.dataApiUrl}/bots/${this.botId}/heartbeat`, {
        headers: {
          Authorization: this.apiKey
        },
        method: "POST"
      }).catch(() => null);
      if (!res) {
        this.log("error", "Failed to send heartbeat");
        return { success: false };
      }
      const success = res.status >= 200 && res.status < 300;
      if (!success)
        this.log("error", "Sent heartbeat returned status : " + res.status);
      return { success };
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  API_URL,
  ClientType,
  DATA_API_URL,
  DISCORD_API_URL,
  Discolytics
});
