export namespace TreasureResources {
	export const TREASURE_COUNT = 10;
	
	export const TREASURE_TYPES = {
		COMMON: "common",
		RARE: "rare",
		EPIC: "epic",
		GOLDEN: "golden"
	};
	
	export const TREASURE_VALUES = {
		[TREASURE_TYPES.COMMON]: 100,
		[TREASURE_TYPES.RARE]: 250,
		[TREASURE_TYPES.EPIC]: 500,
		[TREASURE_TYPES.GOLDEN]: 1000,
		default: 50
	};
	
	export const TREASURE_COLORS = {
		[TREASURE_TYPES.COMMON]: new Color3(0.8, 0.8, 0.8),
		[TREASURE_TYPES.RARE]: new Color3(0, 0.5, 1),
		[TREASURE_TYPES.EPIC]: new Color3(0.7, 0, 1),
		[TREASURE_TYPES.GOLDEN]: new Color3(1, 0.8, 0),
	};
}
