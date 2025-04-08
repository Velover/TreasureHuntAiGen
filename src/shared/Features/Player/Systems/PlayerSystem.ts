import { Controller, Service, OnInit, OnStart } from "@flamework/core";
import { PlayerResources } from "../Resources/PlayerResources";

@Controller({})
@Service({})
export class PlayerSystem implements OnInit, OnStart {
	constructor() {}

	onInit() {
		print("PlayerSystem initialized");
	}

	onStart() {
		print("PlayerSystem started");
	}

	/**
	 * Calculate stamina drain based on activity
	 */
	calculateStaminaDrain(activity: string): number {
		switch (activity) {
			case "running":
				return PlayerResources.STAMINA_DRAIN_RATE.RUNNING;
			case "jumping":
				return PlayerResources.STAMINA_DRAIN_RATE.JUMPING;
			case "climbing":
				return PlayerResources.STAMINA_DRAIN_RATE.CLIMBING;
			default:
				return PlayerResources.STAMINA_DRAIN_RATE.IDLE;
		}
	}

	/**
	 * Calculate stamina regen amount
	 */
	calculateStaminaRegen(): number {
		return PlayerResources.STAMINA_REGEN_RATE;
	}
}
