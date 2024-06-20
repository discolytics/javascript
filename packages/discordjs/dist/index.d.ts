import { Discolytics as Discolytics$1, ShardStatus } from '@discolytics/core';
import { Client } from 'discord.js';

declare class Discolytics {
    core: Discolytics$1;
    private bot;
    private token;
    private autoPostShards;
    postShards: (shards: {
        id: number;
        status: ShardStatus;
        latency: number;
    }[]) => void;
    postCluster: (shards: {
        id: number;
        status: ShardStatus;
        latency: number;
    }[]) => void;
    constructor(data: {
        botId: string;
        apiKey: string;
        dataApiUrl?: string;
        apiUrl?: string;
        bot: Client;
        token?: string;
        clusterId?: number;
        autoPostShards?: boolean;
    });
    private mapShardStatus;
    startCommand(data: {
        name: string;
        userId: string;
        guildId?: string;
    }): {
        end: () => void;
    };
    getClientVersion(): string | undefined;
}

export { Discolytics };
