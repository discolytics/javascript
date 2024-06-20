import {
	Discolytics as CoreClient,
	ClientType,
	ShardStatus,
} from '@discolytics/core';
import type {
	Client as Bot,
	ShardStatus as OceanicShardStatus,
} from 'oceanic.js';
import fs from 'fs';
import path from 'path';

export class Discolytics {
	core: CoreClient;
	private bot: Bot;
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
		clusterId?: number;
		autoPostShards?: boolean;
	}) {
		if (!data.bot.options.auth)
			throw new Error('Auth not passed to OceanicJS client');
		this.core = new CoreClient({
			...data,
			clientType: ClientType.OCEANIC_JS,
			auth: data.bot.options.auth,
			clientVersion: this.getClientVersion(),
		});
		this.bot = data.bot;
		this.autoPostShards = data.autoPostShards ?? true;

		this.postShards = this.core.postShards.bind(this.core);
		this.postCluster = this.core.postCluster.bind(this.core);

		if (this.autoPostShards) {
			this.postShards(
				this.bot.shards.map((shard) => ({
					id: shard.id,
					status: this.mapShardStatus(shard.status),
					latency: shard.latency,
				}))
			);
			setInterval(() => {
				this.postShards(
					this.bot.shards.map((shard) => ({
						id: shard.id,
						status: this.mapShardStatus(shard.status),
						latency: shard.latency,
					}))
				);
			}, 1000 * 15);
		}

		this.bot.on('packet', async (data) => {
			const d = data.d as any;
			this.core.sendEvent(data.t, d?.guild_id);
			if (data.t === 'INTERACTION_CREATE' && d?.type) {
				this.core.postInteraction(d.type, d.guild_id);
			}
		});
	}

	private mapShardStatus(status: OceanicShardStatus): ShardStatus {
		switch (status) {
			case 'connecting':
				return 'connecting';
			case 'ready':
				return 'ready';
			case 'resuming':
				return 'resuming';
			default:
				return 'disconnected';
		}
	}

	startCommand(data: { name: string; userId: string; guildId?: string }) {
		return this.core.startCommand(data);
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
