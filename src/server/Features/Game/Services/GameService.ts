import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/Core/network";
import { Players } from "@rbxts/services";
import { LeaderboardEntry } from "shared/Core/network";
import { GameSystem } from "shared/Features/Game/Systems/GameSystem";

@Service({})
export class GameService implements OnStart, OnInit {
	private leaderboard: LeaderboardEntry[] = [];
	private playerData = new Map<Player, {
		treasuresCollected: number,
		startTime: number,
		completed: boolean
	}>();
	
	constructor(private readonly _gameSystem: GameSystem) {}

	onInit() {
		print("GameService initialized");
	}

	onStart() {
		// Initialize player tracking
		Players.PlayerAdded.Connect((player) => this.handlePlayerAdded(player));
		Players.PlayerRemoving.Connect((player) => this.handlePlayerRemoving(player));
		
		// Set up event listeners
		Events.gameCompleted.connect((player, time, treasuresCollected) => {
			this.handleGameCompleted(player, time, treasuresCollected);
		});
	}
	
	private handlePlayerAdded(player: Player): void {
		// Initialize player data
		this.playerData.set(player, {
			treasuresCollected: 0,
			startTime: os.time(),
			completed: false
		});
	}
	
	private handlePlayerRemoving(player: Player): void {
		this.playerData.delete(player);
	}
	
	private handleGameCompleted(player: Player, time: number, treasuresCollected: number): void {
		const playerData = this.playerData.get(player);
		if (!playerData || playerData.completed) return;
		
		// Mark as completed
		playerData.completed = true;
		
		// Calculate score
		const score = this._gameSystem.calculateScore(treasuresCollected, time);
		
		// Add to leaderboard
		this.leaderboard.push({
			playerName: player.Name,
			score,
			treasuresCollected,
			completionTime: time
		});
		
		// Sort leaderboard by score (descending)
		this.leaderboard.sort((a, b) => b.score - a.score);
		
		// Keep only top 10 scores
		if (this.leaderboard.size() > 10) {
			this.leaderboard = this.leaderboard.slice(0, 10);
		}
		
		// Notify client of game completion
		Events.gameStateChanged.fire(player, "completed");
	}
	
	getLeaderboard(): LeaderboardEntry[] {
		return this.leaderboard;
	}
}
