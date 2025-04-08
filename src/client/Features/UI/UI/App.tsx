import React from "@rbxts/react";
import { HUD } from "./HUD";
import { LeaderboardUI } from "./LeaderboardUI";
import { GameCompletedUI } from "./GameCompletedUI";
import { useFlameworkDependency } from "@rbxts/flamework-react-utils";
import { GameStateController } from "client/Features/Game/Controllers/GameStateController";

export function App() {
	// Get game state controller
	const gameStateController = useFlameworkDependency<GameStateController>();
	const gameState = gameStateController.useGameStateAtom();
	
	return (
		<>
			{/* Always visible HUD with treasure count and timer */}
			<HUD />
			
			{/* Conditionally rendered UI based on game state */}
			{gameState === "playing" && (
				<></>
			)}
			
			{gameState === "completed" && (
				<GameCompletedUI />
			)}
			
			{gameState === "leaderboard" && (
				<LeaderboardUI />
			)}
		</>
	);
}
