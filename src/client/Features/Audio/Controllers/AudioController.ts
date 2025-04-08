import { Controller, OnStart, OnInit } from "@flamework/core";
import { EnvironmentResources } from "shared/Features/Environment/Resources/EnvironmentResources";
import { SoundService } from "@rbxts/services";

@Controller({})
export class AudioController implements OnStart, OnInit {
	private backgroundMusic?: Sound;
	private ambientSounds = new Map<string, Sound>();
	private currentRegion = "";
	
	onInit() {
		print("AudioController initialized");
	}

	onStart() {
		// Create background music
		this.setupBackgroundMusic();
		
		// Create ambient sounds
		this.setupAmbientSounds();
	}
	
	private setupBackgroundMusic(): void {
		// Create background music sound
		this.backgroundMusic = new Instance("Sound");
		this.backgroundMusic.Name = "BackgroundMusic";
		this.backgroundMusic.SoundId = "rbxassetid://1848354536"; // Calm adventure music
		this.backgroundMusic.Volume = 0.3;
		this.backgroundMusic.Looped = true;
		this.backgroundMusic.Parent = SoundService;
		
		// Play background music
		this.backgroundMusic.Play();
	}
	
	private setupAmbientSounds(): void {
		// Create ambient sounds for each region
		for (const [region, soundId] of pairs(EnvironmentResources.REGION_SOUNDS)) {
			const sound = new Instance("Sound");
			sound.Name = `Ambient_${region}`;
			sound.SoundId = soundId;
			sound.Volume = 0;
			sound.Looped = true;
			sound.Parent = SoundService;
			sound.Play();
			
			this.ambientSounds.set(region as string, sound);
		}
	}
	
	// Public methods to be called by other controllers
	playTreasureCollectSound(): void {
		const sound = new Instance("Sound");
		sound.Name = "TreasureCollect";
		sound.SoundId = "rbxassetid://131323304"; // Treasure collection sound
		sound.Volume = 1;
		sound.Parent = SoundService;
		sound.Play();
		
		// Destroy after playing
		sound.Ended.Connect(() => sound.Destroy());
	}
	
	updateRegion(regionName: string): void {
		if (regionName === this.currentRegion) return;
		
		// Fade out current region sound
		if (this.currentRegion !== "") {
			const currentSound = this.ambientSounds.get(this.currentRegion);
			if (currentSound) {
				this.fadeSound(currentSound, 0, 1);
			}
		}
		
		// Fade in new region sound
		const newSound = this.ambientSounds.get(regionName);
		if (newSound) {
			this.fadeSound(newSound, 0.5, 1);
		}
		
		this.currentRegion = regionName;
	}
	
	private fadeSound(sound: Sound, targetVolume: number, duration: number): void {
		const startVolume = sound.Volume;
		const startTime = os.clock();
		
		// Gradually adjust volume
		task.spawn(() => {
			while (task.wait(0.1)) {
				const elapsed = os.clock() - startTime;
				const alpha = math.min(elapsed / duration, 1);
				
				sound.Volume = startVolume + alpha * (targetVolume - startVolume);
				
				if (alpha >= 1) break;
			}
		});
	}
}
