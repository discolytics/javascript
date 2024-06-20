import { Discolytics as Discolytics$1, ShardStatus } from '@discolytics/core';
import { WebSocketManager } from '@discordjs/ws';

declare class Discolytics {
    core: Discolytics$1;
    private manager;
    private token;
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
        manager: WebSocketManager;
        token?: string;
    });
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
