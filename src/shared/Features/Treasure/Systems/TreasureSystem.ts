import { Controller, Service, OnInit, OnStart } from "@flamework/core";
import { TreasureData } from "shared/Core/network";
import { TreasureResources } from "../Resources/TreasureResources";

@Controller({})
@Service({})
export class TreasureSystem implements OnInit, OnStart {
	constructor() {}

	onInit() {
		print("TreasureSystem initialized");
	}

	onStart() {
		print("TreasureSystem started");
	}

	/**
	 * Get treasure value based on type
	 */
	getTreasureValue(type: string): number {
		return TreasureResources.TREASURE_VALUES[type] ?? TreasureResources.TREASURE_VALUES.default;
	}

	/**
	 * Generate a unique ID for a treasure
	 */
	generateTreasureId(): string {
		return `treasure_${math.random()}`.sub(3, 10);
	}
}
