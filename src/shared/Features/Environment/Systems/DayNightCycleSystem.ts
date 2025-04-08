import { Controller, Service, OnInit, OnStart } from "@flamework/core";
import { EnvironmentResources } from "../Resources/EnvironmentResources";

@Controller({})
@Service({})
export class DayNightCycleSystem implements OnInit, OnStart {
	private currentCycleTime = 0;
	private isDay = true;
	
	constructor() {}

	onInit() {
		print("DayNightCycleSystem initialized");
	}

	onStart() {
		print("DayNightCycleSystem started");
	}

	/**
	 * Update the day-night cycle
	 */
	updateCycle(deltaTime: number): void {
		this.currentCycleTime += deltaTime;
		
		if (this.currentCycleTime >= EnvironmentResources.DAY_NIGHT_CYCLE_DURATION) {
			this.currentCycleTime = 0;
			this.isDay = !this.isDay;
		}
	}

	/**
	 * Get the current lighting values based on cycle time
	 */
	getLightingValues(): { brightness: number, ambient: Color3 } {
		// Calculate how far through the current phase we are (0-1)
		const phaseProgress = this.currentCycleTime / EnvironmentResources.DAY_NIGHT_CYCLE_DURATION;
		
		if (this.isDay) {
			// Daytime lighting
			return {
				brightness: 2 - phaseProgress * 0.5, // 2.0 to 1.5
				ambient: Color3.fromRGB(
					150,
					150 - math.floor(phaseProgress * 50),
					150
				)
			};
		} else {
			// Nighttime lighting
			return {
				brightness: 1.5 - phaseProgress, // 1.5 to 0.5
				ambient: Color3.fromRGB(
					100 - math.floor(phaseProgress * 50),
					100 - math.floor(phaseProgress * 50),
					150
				)
			};
		}
	}
	
	/**
	 * Check if it's currently day time
	 */
	getIsDay(): boolean {
		return this.isDay;
	}
}
