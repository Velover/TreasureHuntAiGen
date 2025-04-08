import React from "@rbxts/react";
import { useFlameworkDependency } from "@rbxts/flamework-react-utils";
import { PlayerController } from "client/Features/Player/Controllers/PlayerController";
import { TreasureController } from "client/Features/Treasure/Controllers/TreasureController";
import { GameStateController } from "client/Features/Game/Controllers/GameStateController";

export function HUD() {
	// Get controllers
	const playerController = useFlameworkDependency<PlayerController>();
	const treasureController = useFlameworkDependency<TreasureController>();
	const gameStateController = useFlameworkDependency<GameStateController>();
	
	// Get state atoms
	const stamina = playerController.useStaminaAtom();
	const maxStamina = playerController.useMaxStaminaAtom();
	const treasuresCollected = treasureController.useTreasuresCollectedAtom();
	const totalTreasures = treasureController.useTotalTreasuresAtom();
	const gameTime = gameStateController.useGameTimeAtom();
	
	// Format time as MM:SS
	const minutes = math.floor(gameTime / 60);
	const seconds = math.floor(gameTime % 60);
	const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	
	return (
		<screengui ResetOnSpawn={false}>
			{/* Top bar with counters */}
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				Position={new UDim2(0, 0, 0, 0)}
				BackgroundTransparency={0.5}
				BackgroundColor3={Color3.fromRGB(50, 50, 50)}
			>
				{/* Treasure counter */}
				<frame
					Size={new UDim2(0.25, 0, 1, 0)}
					Position={new UDim2(0, 0, 0, 0)}
					BackgroundTransparency={1}
				>
					<textlabel
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						Text={`Treasures: ${treasuresCollected}/${totalTreasures}`}
						TextColor3={Color3.fromRGB(255, 215, 0)}
						Font={Enum.Font.GothamBold}
						TextScaled={true}
					/>
				</frame>
				
				{/* Timer */}
				<frame
					Size={new UDim2(0.25, 0, 1, 0)}
					Position={new UDim2(0.25, 0, 0, 0)}
					BackgroundTransparency={1}
				>
					<textlabel
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						Text={`Time: ${formattedTime}`}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={Enum.Font.GothamSemibold}
						TextScaled={true}
					/>
				</frame>
				
				{/* Stamina bar */}
				<frame
					Size={new UDim2(0.5, 0, 0.3, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={Color3.fromRGB(50, 50, 50)}
					BorderSizePixel={0}
				>
					<frame
						Size={new UDim2(stamina / maxStamina, 0, 1, 0)}
						BackgroundColor3={Color3.fromRGB(87, 206, 145)}
						BorderSizePixel={0}
					/>
					
					<textlabel
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						Text={`Stamina: ${math.floor(stamina)}/${maxStamina}`}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={Enum.Font.GothamSemibold}
						TextScaled={true}
					/>
				</frame>
			</frame>
		</screengui>
	);
}
