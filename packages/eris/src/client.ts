import {
	Discolytics as CoreClient,
	ClientType,
	ShardStatus,
} from '@discolytics/core';
import { Client as Bot } from 'eris';

type ErisShardStatus =
	| 'connecting'
	| 'disconnected'
	| 'handshaking'
	| 'identifying'
	| 'ready'
	| 'resuming';

export class Discolytics {
	private core: CoreClient;
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
		const token = (data.bot as any)._token;
		if (!token) throw new Error('Auth not passed to Eris client');
		this.core = new CoreClient({
			...data,
			clientType: ClientType.ERIS,
			auth: token,
		});
		this.bot = data.bot;
		this.autoPostShards = data.autoPostShards ?? true;

		this.postShards = this.core.postShards.bind(this.core);
		this.postCluster = this.core.postCluster.bind(this.core);

		if (this.autoPostShards) {
			setInterval(() => {
				this.postShards(
					this.bot.shards.map((shard) => ({
						id: shard.id,
						status: this.mapShardStatus(shard.status),
						latency: shard.latency == Infinity ? -1 : shard.latency,
					}))
				);
			}, 1000 * 15);
		}

		this.bot.on('rawWS', async (data) => {
			if (!data.t) return;
			const d = data.d as any;
			this.core.sendEvent(data.t, d?.guild_id);
			if (data.t === 'INTERACTION_CREATE' && d?.type) {
				this.core.postInteraction(d.type, d.guild_id);
			}
		});
	}

	private mapShardStatus(status: ErisShardStatus): ShardStatus {
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
}
