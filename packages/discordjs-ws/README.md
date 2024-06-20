# 1. Installation

> npm install @discolytics/discordjs

# 2. Get API Key

Under the API Keys tab of your dashboard, create a new API key. Copy this key and your bot ID to connect within your codebase.

# 3. Example Usage

Initiate the client library in your codebase. When initiating the Discolytics client, pass your Discord JS client for the bot property. Enter your bot ID and API key from the previous step to connect, as well as your bot token under the token option.

> Your bot token is never sent to Discolytics servers. It is used by our client libraries on your machine to make requests to Discord on your behalf for metadata and analytics (such as to request your bot profile, guild count, etc).

```js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Discolytics } = require('@discolytics/discordjs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const discolytics = new Discolytics({
	botId: 'YOUR_BOT_ID', // your bot ID from the Discolytics dashboard, not your bot user
	apiKey: process.env.DISCOLYTICS_KEY,
	bot: client,
	token: process.env.TOKEN,
});

// use discolytics.postShards() to send a heartbeat and send an array of shards. If you are clustering your bot, you can also use discolytics.postCluster() which accepts the same arguments.
// valid shard statuses include: 'ready' | 'connecting' | 'reconnecting' | 'resuming' | 'disconnected'
discolytics.postShards([{ id: 0, status: 'ready', latency: 20 }]);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	// start a new command with discolytics.startCommand()
	const command = discolytics.startCommand({
		name: 'help',
		userId: '123',
		guildId: '123', // optional
	});

	setTimeout(() => {
		// run the .end() method on the command to end it, posts the command with the calculated duration
		command.end();
	}, 5000);
});

client.login(process.env.TOKEN);
```

# Support

Join our Discord server for help and support.

- https://discord.gg/aDPeJDcumz
