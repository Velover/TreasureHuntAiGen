import { Service, OnStart, OnInit } from "@flamework/core";
import { Events, Functions } from "server/Core/network";
import { TreasureSystem } from "shared/Features/Treasure/Systems/TreasureSystem";
import { TreasureResources } from "shared/Features/Treasure/Resources/TreasureResources";
import { TreasureData } from "shared/Core/network";
import { Workspace, ReplicatedStorage } from "@rbxts/services";

@Service({})
export class TreasureService implements OnStart, OnInit {
	private treasures = new Map<string, TreasureData>();
	private playerTreasures = new Map<Player, string[]>();
	
	constructor(private readonly _treasureSystem: TreasureSystem) {}

	onInit() {
		print("TreasureService initialized");
	}

	onStart() {
		// Initialize treasures
		this.spawnTreasures();
		
		// Set up event listeners
		Events.treasureCollected.connect((player, treasureId) => {
			this.collectTreasure(player, treasureId);
		});
		
		// Set up functions
		Functions.getTreasureLocations.setCallback(() => {
			return [...this.treasures.values()];
		});
	}
	
	private spawnTreasures(): void {
		// Define treasure locations with different types
		const treasureLocations = [
			{ position: new Vector3(10, 5, 10), type: TreasureResources.TREASURE_TYPES.COMMON },
			{ position: new Vector3(-15, 5, 20), type: TreasureResources.TREASURE_TYPES.COMMON },
			{ position: new Vector3(25, 6, -5), type: TreasureResources.TREASURE_TYPES.COMMON },
			{ position: new Vector3(-20, 5, -25), type: TreasureResources.TREASURE_TYPES.COMMON },
			{ position: new Vector3(0, 10, 40), type: TreasureResources.TREASURE_TYPES.RARE },
			{ position: new Vector3(-35, 15, -10), type: TreasureResources.TREASURE_TYPES.RARE },
			{ position: new Vector3(30, 20, 30), type: TreasureResources.TREASURE_TYPES.RARE },
			{ position: new Vector3(5, 35, 5), type: TreasureResources.TREASURE_TYPES.EPIC },
			{ position: new Vector3(-45, 40, -5), type: TreasureResources.TREASURE_TYPES.EPIC },
			{ position: new Vector3(0, 100, 0), type: TreasureResources.TREASURE_TYPES.GOLDEN } // Mountain peak
		];
		
		// Create each treasure
		for (const location of treasureLocations) {
			const treasureId = this._treasureSystem.generateTreasureId();
			const value = this._treasureSystem.getTreasureValue(location.type);
			
			// Store treasure data
			const treasureData: TreasureData = {
				id: treasureId,
				position: location.position,
				value: value,
				type: location.type
			};
			
			this.treasures.set(treasureId, treasureData);
			
			// Spawn physical treasure
			this.createTreasureInstance(treasureData);
		}
	}
	
	private createTreasureInstance(treasureData: TreasureData): void {
		// Create a part to represent the treasure chest
		const chest = new Instance("Part");
		chest.Name = `Treasure_${treasureData.id}`;
		chest.Position = treasureData.position;
		chest.Size = new Vector3(3, 3, 3);
		chest.Anchored = true;
		chest.CanCollide = true;
		
		// Set color based on treasure type
		const color = TreasureResources.TREASURE_COLORS[treasureData.type as keyof typeof TreasureResources.TREASURE_COLORS];
		if (color) {
			chest.BrickColor = new BrickColor(color);
		}
		
		// Add visual elements (mesh, decoration)
		const mesh = new Instance("SpecialMesh");
		mesh.MeshType = Enum.MeshType.FileMesh;
		mesh.MeshId = "rbxassetid://6768280852"; // Treasure chest mesh
		mesh.Parent = chest;
		
		// Add attribute for easy identification
		chest.SetAttribute("TreasureId", treasureData.id);
		
		// Parent to workspace
		chest.Parent = Workspace;
	}
	
	collectTreasure(player: Player, treasureId: string): void {
		// Check if treasure exists
		const treasureData = this.treasures.get(treasureId);
		if (!treasureData) return;
		
		// Check if player already collected this treasure
		let playerCollected = this.playerTreasures.get(player);
		if (!playerCollected) {
			playerCollected = [];
			this.playerTreasures.set(player, playerCollected);
		}
		
		if (playerCollected.includes(treasureId)) return; // Already collected
		
		// Add to player's collected treasures
		playerCollected.push(treasureId);
		
		// Remove physical treasure
		const treasureInstance = Workspace.FindFirstChild(`Treasure_${treasureId}`) as BasePart;
		if (treasureInstance) {
			treasureInstance.Destroy();
		}
		
		// Notify client
		Events.treasureCollected.fire(player, treasureId, playerCollected.size());
	}
}
