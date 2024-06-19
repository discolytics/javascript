import {
	Discolytics as CoreClient,
	ClientType,
	type ShardStatus,
} from '@discolytics/core';
import { Client as Bot, Status } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { parseToken } from './utils';

export class Discolytics {
	core: CoreClient;
	private bot: Bot;
	private token: string;
	private autoPostShards: boolean;

	postShards: (
		shards: { id: number; status: ShardStatus; latency: number }[]
	) => void;
	postCluster: (
		shards: { id: number; status: ShardStatus; latency: number }[]
	) => void;

	constructor(data: {
		botId: string;
		apiKey: string;
		dataApiUrl?: string;
		apiUrl?: string;
		bot: Bot;
		token?: string;
		clusterId?: number;
		autoPostShards?: boolean;
	}) {
		this.token = data.token ?? data.bot.token ?? '';
		if (!this.token) throw new Error('Auth not passed to DiscordJS client');
		this.token = parseToken(this.token);
		this.core = new CoreClient({
			...data,
			clientType: ClientType.DISCORD_JS,
			auth: this.token,
			clientVersion: this.getClientVersion(),
		});
		this.bot = data.bot;
		this.autoPostShards = data.autoPostShards ?? true;

		this.postShards = this.core.postShards.bind(this.core);
		this.postCluster = this.core.postCluster.bind(this.core);

		if (this.autoPostShards) {
			this.postShards(
				this.bot.ws.shards.map((shard) => ({
					id: shard.id,
					status: this.mapShardStatus(shard.status),
					latency: shard.ping,
				}))
			);
			setInterval(() => {
				this.postShards(
					this.bot.ws.shards.map((shard) => ({
						id: shard.id,
						status: this.mapShardStatus(shard.status),
						latency: shard.ping,
					}))
				);
			}, 1000 * 15);
		}

		this.bot.on('raw', async (data) => {
			const d = data.d as any;
			this.core.sendEvent(data.t, d?.guild_id);
			if (data.t === 'INTERACTION_CREATE' && d?.type) {
				this.core.postInteraction(d.type, d.guild_id);
			}
		});
	}

	private mapShardStatus(status: Status): ShardStatus {
		switch (status) {
			case Status.Connecting:
				return 'connecting';
			case Status.Reconnecting:
				return 'reconnecting';
			case Status.Resuming:
				return 'resuming';
			case Status.Ready:
				return 'ready';
			default:
				return 'disconnected';
		}
	}

	startCommand(name: string, userId: string) {
		return this.core.startCommand(name, userId);
	}

	getClientVersion(): string | undefined {
		try {
			const json = JSON.parse(
				fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
			);
			return json?.version ?? undefined;
		} catch {
			return undefined;
		}
	}
}
