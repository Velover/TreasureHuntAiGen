import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { createRoot } from "@rbxts/react-roblox";
import React from "@rbxts/react";
import { App } from "../UI/App";

@Controller({})
export class UIController implements OnStart, OnInit {
	onInit() {
		print("UIController initialized");
	}

	onStart() {
		// Create UI container
		const container = new Instance("ScreenGui");
		container.ResetOnSpawn = false;
		container.Name = "TreasureHuntUI";
		container.Parent = Players.LocalPlayer.WaitForChild("PlayerGui");
		
		// Create and render React root
		const root = createRoot(container);
		root.render(React.createElement(App, {}));
	}
}
