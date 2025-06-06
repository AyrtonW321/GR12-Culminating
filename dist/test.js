import { SquirtleCard, WartortleCard, BlastoiseCard } from "./SquirtleEvoClass.js";
import { User } from "./UserClass.js";
function simulateSquirtleEvolutionBattle() {
    console.log("===== SQUIRTLE EVOLUTION LINE BATTLE =====");
    // Create our Pokémon
    const squirtle = new SquirtleCard();
    const wartortle = new WartortleCard();
    const blastoise = new BlastoiseCard();
    // Energy attachments
    squirtle.attachEnergy("water", 2);
    squirtle.attachEnergy("normal", 1);
    wartortle.attachEnergy("water", 2);
    wartortle.attachEnergy("normal", 1);
    blastoise.attachEnergy("water", 3);
    blastoise.attachEnergy("normal", 1);
    console.log("\n=== ROUND 1: Squirtle vs Wartortle ===");
    squirtle.IsActive = true;
    wartortle.IsActive = true;
    console.log(`Squirtle HP: ${squirtle.CurrentHP}, Wartortle HP: ${wartortle.CurrentHP}`);
    console.log(`Squirtle energy:`, squirtle.AttachedEnergyType.map((t, i) => `${t}:${squirtle.AttachedEnergyAmount[i]}`).join(', '));
    // Squirtle attacks Wartortle (no weakness)
    squirtle.Attacks[0].attackAction(wartortle, squirtle); // Water Gun 20 damage
    console.log(`Wartortle HP now: ${wartortle.CurrentHP}`);
    // Wartortle attacks Squirtle
    wartortle.Attacks[1].attackAction(squirtle, wartortle); // Wave Splash 40 damage
    console.log(`Squirtle HP now: ${squirtle.CurrentHP}`);
    console.log("\n=== ROUND 2: Wartortle vs Blastoise ===");
    console.log("Squirtle evolved into Blastoise!");
    blastoise.IsActive = true;
    squirtle.IsActive = false;
    console.log(`Wartortle HP: ${wartortle.CurrentHP}, Blastoise HP: ${blastoise.CurrentHP}`);
    console.log(`Blastoise energy:`, blastoise.AttachedEnergyType.map((t, i) => `${t}:${blastoise.AttachedEnergyAmount[i]}`).join(', '));
    // Blastoise attacks Wartortle
    blastoise.Attacks[0].attackAction(wartortle, blastoise); // Hydro Pump 80 damage
    console.log(`Wartortle HP now: ${wartortle.CurrentHP}`);
    console.log("\n=== BATTLE RESULTS ===");
    console.log("- Squirtle evolution line tested successfully!");
    console.log("- Final HP values:");
    console.log(`  Squirtle: ${squirtle.CurrentHP}`);
    console.log(`  Wartortle: ${wartortle.CurrentHP}`);
    console.log(`  Blastoise: ${blastoise.CurrentHP}`);
}
// Run the simulation
simulateSquirtleEvolutionBattle();
let user = new User("apples");
let booster = user.openBoosterPack();
booster.forEach(pokemon => {
    console.log(pokemon.pokemonName);
});
//# sourceMappingURL=test.js.map