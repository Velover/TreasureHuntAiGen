import { Controller, OnStart, OnInit } from "@flamework/core";
import { Events } from "client/Core/network";
import { atom, effect } from "@rbxts/charm";
import { TreasureController } from "client/Features/Treasure/Controllers/TreasureController";
import { TreasureResources } from "shared/Features/Treasure/Resources/TreasureResources";

type GameState = "playing" | "completed" | "leaderboard";

@Controller({})
export class GameStateController implements OnStart, OnInit {
	// State atoms
	private _gameStateAtom = atom<GameState>("playing");
	private _gameTimeAtom = atom<number>(0);
	private _scoreAtom = atom<number>(0);
	
	// Timer handling
	private gameStartTime = 0;
	private isRunning = true;
	
	constructor(
		private readonly _treasureController: TreasureController
	) {}

	onInit() {
		print("GameStateController initialized");
	}

	onStart() {
		// Start game timer
		this.gameStartTime = os.time();
		
		// Listen for game state changes from server
		Events.gameStateChanged.connect((state) => {
			if (state === "completed") {
				this._gameStateAtom("completed");
				this.isRunning = false;
			}
		});
		
		// Update timer
		task.spawn(() => {
			while (this.isRunning) {
				const currentTime = os.time();
				const elapsed = currentTime - this.gameStartTime;
				this._gameTimeAtom(elapsed);
				task.wait(0.1); // Update every 0.1 seconds
			}
		});
		
		// Check for game completion
		effect(() => {
			const collected = this._treasureController.useTreasuresCollectedAtom();
			const total = TreasureResources.TREASURE_COUNT;
			
			// Game completed when all treasures are found
			if (collected === total) {
				const time = this._gameTimeAtom();
				Events.gameCompleted.fire(time, collected);
				this._gameStateAtom("completed");
				this.isRunning = false;
			}
		});
	}
	
	// Public accessors for UI
	useGameStateAtom() {
		return this._gameStateAtom();
	}
	
	useGameTimeAtom() {
		return this._gameTimeAtom();
	}
	
	useScoreAtom() {
		return this._scoreAtom();
	}
}
