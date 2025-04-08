import { Flamework } from "@flamework/core";

Flamework.addPaths("src/server/Core");
Flamework.addPaths("src/server/Features");
Flamework.addPaths("src/shared/Core");
Flamework.addPaths("src/shared/Features");

Flamework.ignite();
