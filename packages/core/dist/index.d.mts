declare const DATA_API_URL = "https://data.discolytics.com/api";
declare const API_URL = "https://api.discolytics.com/api";
declare const DISCORD_API_URL = "https://discord.com/api/v10";
declare enum ClientType {
    UNKNOWN = 0,
    DISCORD_JS = 1,
    ERIS = 2,
    OCEANIC_JS = 3,
    PYCORE = 4,
    DISCORDJS_WS = 5
}
type LOG_LEVEL = 'info' | 'error' | 'debug';
type ShardStatus = 'ready' | 'connecting' | 'reconnecting' | 'resuming' | 'disconnected';

interface GetBotData {
    captureEvents: string[];
    botUserId: string | null;
    botUserName: string | null;
    botUserAvatar: string | null;
    profileLastUpdated: number | null;
}
interface PatchBotData {
    botUserId?: string;
    botUserName?: string;
    botUserAvatar?: string;
    clientType?: ClientType;
    clientVersion?: string;
}
declare class Discolytics {
    private botId;
    private apiKey;
    private clientType;
    private clientVersion?;
    private dataApiUrl;
    private apiUrl;
    private auth;
    logLevels: Record<LOG_LEVEL, boolean>;
    private pendingEvents;
    private pendingInteractions;
    private pendingCommands;
    private clusterId?;
    constructor(data: {
        botId: string;
        apiKey: string;
        clientType?: ClientType;
        clientVersion?: string;
        dataApiUrl?: string;
        apiUrl?: string;
        auth: string;
        clusterId?: number;
    });
    private isCluster;
    postShards(shards: {
        id: number;
        status: ShardStatus;
        latency: number;
    }[]): Promise<{
        success: boolean;
    }>;
    postCluster(shards: {
        id: number;
        status: ShardStatus;
        latency: number;
    }[]): Promise<{
        success: boolean;
    }>;
    log(level: LOG_LEVEL, ...args: any[]): void;
    getBot(): Promise<{
        success: false;
        data: null;
    } | {
        success: true;
        data: GetBotData;
    }>;
    patchBot(data: PatchBotData): Promise<{
        success: boolean;
    }>;
    private postEvents;
    /**
     * Adds an event to the queue. The queue is posted to Discolytics every 15 seconds.
     */
    sendEvent(name: string, guildId?: string): void;
    private postInteractions;
    /**
     * Adds an interaction to the queue. The queue is posted to Discolytics every 15 seconds.
     */
    postInteraction(type: number, guildId?: string): void;
    startCommand(data: {
        name: string;
        userId: string;
        guildId?: string;
    }): {
        end: () => void;
    };
    postCommands(): Promise<{
        success: boolean;
    }>;
    postCommand(data: {
        name: string;
        userId: string;
        duration: number;
        guildId?: string;
    }): void;
    private getBotUser;
    private getAvatarUrl;
    private getApplication;
    private getGuildCount;
    private postGuildCount;
}

export { API_URL, ClientType, DATA_API_URL, DISCORD_API_URL, Discolytics, type LOG_LEVEL, type ShardStatus };
