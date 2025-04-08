import { Controller, Service, OnInit, OnStart } from "@flamework/core";

@Controller({})
@Service({})
export class GameSystem implements OnInit, OnStart {
	constructor() {}

	onInit() {
		print("GameSystem initialized");
	}

	onStart() {
		print("GameSystem started");
	}

	/**
	 * Calculate score based on treasures collected and time
	 */
	calculateScore(treasuresCollected: number, timeElapsed: number): number {
		// Base score from treasures
		const treasureScore = treasuresCollected * 100;
		
		// Time bonus (faster completion = higher score)
		const timeBonus = Math.max(0, 3000 - timeElapsed * 10);
		
		return treasureScore + timeBonus;
	}
}
