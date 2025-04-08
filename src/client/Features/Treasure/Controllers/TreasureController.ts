import { Controller, OnStart, OnInit } from "@flamework/core";
import { Events, Functions } from "client/Core/network";
import { TreasureResources } from "shared/Features/Treasure/Resources/TreasureResources";
import { TreasureData } from "shared/Core/network";
import { atom } from "@rbxts/charm";

@Controller({})
export class TreasureController implements OnStart, OnInit {
	// State atoms
	private _treasuresCollectedAtom = atom<number>(0);
	private _totalTreasuresAtom = atom<number>(TreasureResources.TREASURE_COUNT);
	private _treasureDataAtom = atom<TreasureData[]>([]);
	
	onInit() {
		print("TreasureController initialized");
	}

	onStart() {
		// Get treasure data from server
		Functions.getTreasureLocations().then((treasures) => {
			this._treasureDataAtom(treasures);
		});
		
		// Listen for treasure collection events
		Events.treasureCollected.connect((treasureId, totalCollected) => {
			this._treasuresCollectedAtom(totalCollected);
		});
	}
	
	// Public accessors for UI and other controllers
	useTreasuresCollectedAtom() {
		return this._treasuresCollectedAtom();
	}
	
	useTotalTreasuresAtom() {
		return this._totalTreasuresAtom();
	}
}
