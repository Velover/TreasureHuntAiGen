import { Networking } from "@flamework/networking";

interface ClientToServerEvents {
	treasureCollected: (treasureId: string) => void;
	gameCompleted: (time: number, treasuresCollected: number) => void;
	stamiaUsed: (amount: number) => void;
}

interface ServerToClientEvents {
	treasureSpawned: (treasureId: string, position: Vector3) => void;
	staminaUpdated: (currentStamina: number, maxStamina: number) => void;
	gameStateChanged: (state: string) => void;
	treasureCollected: (treasureId: string, totalCollected: number) => void;
	dayNightCycleChanged: (isDay: boolean) => void;
}

interface ClientToServerFunctions {
	getLeaderboard: () => LeaderboardEntry[];
	getPlayerData: () => PlayerData;
}

interface ServerToClientFunctions {
	getTreasureLocations: () => TreasureData[];
}

export interface LeaderboardEntry {
	playerName: string;
	score: number;
	treasuresCollected: number;
	completionTime: number;
}

export interface PlayerData {
	treasuresCollected: number;
	currentStamina: number;
	maxStamina: number;
	score: number;
}

export interface TreasureData {
	id: string;
	position: Vector3;
	value: number;
	type: string;
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
