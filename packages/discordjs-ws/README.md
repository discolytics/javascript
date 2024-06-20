# 1. Installation

> npm install @discolytics/discordjs-ws

# 2. Get API Key

Under the API Keys tab of your dashboard, create a new API key. Copy this key and your bot ID to connect within your codebase.

# 3. Example Usage

Initiate the client library in your codebase. When initiating the Discolytics client, pass your Discord JS client for the bot property. Enter your bot ID and API key from the previous step to connect, as well as your bot token under the token option.

> Your bot token is never sent to Discolytics servers. It is used by our client libraries on your machine to make requests to Discord on your behalf for metadata and analytics (such as to request your bot profile, guild count, etc).

```js
require('dotenv').config();
const { WebSocketManager } = require('@discordjs/ws');
const { REST } = require('@discordjs/rest');
const { Discolytics } = require('@discolytics/discordjs-ws');

const rest = new REST().setToken(process.env.TOKEN);
const manager = new WebSocketManager({
	token: process.env.TOKEN,
	intents: 0,
	rest,
});

const discolytics = new Discolytics({
	apiKey: process.env.DISCOLYTICS_KEY,
	botId: 'YOUR_BOT_ID', // your bot ID from the Discolytics dashboard, not your bot user
	token: process.env.TOKEN,
	manager,
});

// use discolytics.postShards() to send a heartbeat and send an array of shards. If you are clustering your bot, you can also use discolytics.postCluster() which accepts the same arguments.
// valid shard statuses include: 'ready' | 'connecting' | 'reconnecting' | 'resuming' | 'disconnected'
discolytics.postShards([{ id: 0, status: 'ready', latency: 20 }]);

manager.connect();
```

# Support

Join our Discord server for help and support.

- https://discord.gg/aDPeJDcumz
