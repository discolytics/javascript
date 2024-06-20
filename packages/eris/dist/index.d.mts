import { ShardStatus } from '@discolytics/core';
import { Client } from 'eris';

declare class Discolytics {
    private core;
    private bot;
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
}

export { Discolytics };
