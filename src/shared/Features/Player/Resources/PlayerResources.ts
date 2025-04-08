export namespace PlayerResources {
	export const MAX_STAMINA = 100;
	
	export const STAMINA_DRAIN_RATE = {
		RUNNING: 1,
		JUMPING: 5,
		CLIMBING: 2,
		IDLE: 0
	};
	
	export const STAMINA_REGEN_RATE = 0.5;
	
	export const FRUIT_STAMINA_RESTORE = 25;
	
	export const SPAWN_LOCATION = new Vector3(0, 5, 0); // Beach spawn location
}
