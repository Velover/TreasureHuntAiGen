import { Controller, OnStart, OnInit } from "@flamework/core";
import { Events } from "client/Core/network";
import { PlayerResources } from "shared/Features/Player/Resources/PlayerResources";
import { Players, UserInputService, RunService } from "@rbxts/services";
import { atom } from "@rbxts/charm";

@Controller({})
export class PlayerController implements OnStart, OnInit {
	// Player state atoms
	private _staminaAtom = atom<number>(PlayerResources.MAX_STAMINA);
	private _maxStaminaAtom = atom<number>(PlayerResources.MAX_STAMINA);
	private _isRunningAtom = atom<boolean>(false);
	
	// Character tracking
	private character?: Character;
	private humanoid?: Humanoid;
	
	onInit() {
		print("PlayerController initialized");
	}

	onStart() {
		// Set up character handling
		this.setupCharacter();
		Players.LocalPlayer.CharacterAdded.Connect(() => this.setupCharacter());
		
		// Listen for stamina updates from server
		Events.staminaUpdated.connect((currentStamina, maxStamina) => {
			this._staminaAtom(currentStamina);
			this._maxStaminaAtom(maxStamina);
		});
		
		// Handle running state
		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.LeftShift) {
				this._isRunningAtom(true);
			}
		});
		
		UserInputService.InputEnded.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.LeftShift) {
				this._isRunningAtom(false);
			}
		});
		
		// Handle stamina client-side (will be validated by server)
		RunService.Heartbeat.Connect((dt) => this.updateStamina(dt));
	}
	
	private setupCharacter(): void {
		const player = Players.LocalPlayer;
		this.character = player.Character ?? (player.CharacterAdded.Wait()[0] as Character);
		this.humanoid = this.character.FindFirstChildOfClass("Humanoid");
		
		// Set up stamina to max
		this._staminaAtom(PlayerResources.MAX_STAMINA);
	}
	
	private updateStamina(dt: number): void {
		if (!this.humanoid) return;
		
		const isRunning = this._isRunningAtom();
		let stamina = this._staminaAtom();
		const maxStamina = this._maxStaminaAtom();
		
		if (isRunning && this.humanoid.MoveDirection.Magnitude > 0.1) {
			// Drain stamina while running
			stamina -= PlayerResources.STAMINA_DRAIN_RATE.RUNNING * dt;
			
			// Notify server about stamina usage
			Events.stamiaUsed.fire(PlayerResources.STAMINA_DRAIN_RATE.RUNNING * dt);
			
			// Apply running speed if we have stamina
			if (stamina > 0) {
				this.humanoid.WalkSpeed = 24; // Running speed
			} else {
				this.humanoid.WalkSpeed = 16; // Normal speed
				this._isRunningAtom(false);
			}
		} else {
			// Regen stamina when not running
			stamina = math.min(stamina + PlayerResources.STAMINA_REGEN_RATE * dt, maxStamina);
			this.humanoid.WalkSpeed = 16; // Normal speed
		}
		
		// Update local stamina (server will validate)
		stamina = math.max(0, math.min(stamina, maxStamina));
		this._staminaAtom(stamina);
	}
	
	// Public accessors for UI
	useStaminaAtom() {
		return this._staminaAtom();
	}
	
	useMaxStaminaAtom() {
		return this._maxStaminaAtom();
	}
	
	useIsRunningAtom() {
		return this._isRunningAtom();
	}
}
