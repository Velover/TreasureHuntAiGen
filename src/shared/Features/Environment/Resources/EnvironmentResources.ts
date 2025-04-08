export namespace EnvironmentResources {
	// Day/night cycle duration in seconds
	export const DAY_NIGHT_CYCLE_DURATION = 300; // 5 minutes
	
	// Environment regions
	export const REGIONS = {
		BEACH: "beach",
		FOREST: "forest",
		MOUNTAIN: "mountain",
		CAVE: "cave"
	};
	
	// Region ambient sounds
	export const REGION_SOUNDS = {
		[REGIONS.BEACH]: "rbxassetid://169728610", // Waves sound
		[REGIONS.FOREST]: "rbxassetid://169577569", // Forest sounds
		[REGIONS.MOUNTAIN]: "rbxassetid://191739309", // Wind sounds
		[REGIONS.CAVE]: "rbxassetid://171143559" // Cave dripping
	};
	
	// Special locations
	export const SPECIAL_LOCATIONS = {
		MOUNTAIN_PEAK: new Vector3(0, 100, 0),
		HIDDEN_CAVE: new Vector3(-50, 10, -50)
	};
}
