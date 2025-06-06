"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SquirtleEvoClass_js_1 = require("../Pokemon Classes/SquirtleEvoClass.js");
var PokedexInfo_js_1 = require("./PokedexInfo.js");
var AttacksClass_js_1 = require("./AttacksClass.js");
var PokemonCardsClass_js_1 = require("./PokemonCardsClass.js");
// Create a simple Electric-type opponent (Pikachu)
var PikachuCard = /** @class */ (function (_super) {
    __extends(PikachuCard, _super);
    function PikachuCard() {
        var pokedexInfo = new PokedexInfo_js_1.PokedexInfo(25, 0.4, 6.0);
        return _super.call(this, 1, "", "Pikachu", false, "electric", 70, 1, "ground", "pikachu.png", "When several of these Pokémon gather, their electricity could build and cause lightning storms.", 1, pokedexInfo, [new Thundershock()]) || this;
    }
    return PikachuCard;
}(PokemonCardsClass_js_1.PokemonCard));
var Thundershock = /** @class */ (function (_super) {
    __extends(Thundershock, _super);
    function Thundershock() {
        return _super.call(this, "Thundershock", "May cause paralysis", 30, 0, ["electric", "normal"], [1, 0], 1, "paralysis") || this;
    }
    Thundershock.prototype.attackAction = function (defender, attacker) {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Thundershock");
            return false;
        }
        var damage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(damage);
        // 50% chance to paralyze (from coinflipCount = 1)
        if (this.flipCoin()) {
            defender.applyStatusCondition("PARALYZED");
            console.log("".concat(defender.pokemonName, " was paralyzed!"));
        }
        console.log("Thundershock deals ".concat(damage, " damage to ").concat(defender.pokemonName));
        return true;
    };
    return Thundershock;
}(AttacksClass_js_1.Attack));
// Test Battle Simulation
function simulateBattle() {
    console.log("===== POKÉMON BATTLE SIMULATION =====");
    // Create our water Pokémon team
    var squirtle = new SquirtleEvoClass_js_1.SquirtleCard();
    var wartortle = new SquirtleEvoClass_js_1.WartortleCard();
    var blastoise = new SquirtleEvoClass_js_1.BlastoiseCard();
    var blastoiseEX = new SquirtleEvoClass_js_1.BlastoiseEXCard();
    // Create opponent
    var pikachu = new PikachuCard();
    // Attach energy to our Pokémon (needed for attacks)
    squirtle.attachEnergy("water", 2);
    wartortle.attachEnergy("water", 3);
    blastoise.attachEnergy("water", 4);
    blastoiseEX.attachEnergy("water", 5);
    pikachu.attachEnergy("electric", 2);
    // Make Pokémon active
    squirtle.IsActive = true;
    pikachu.IsActive = true;
    console.log("\n=== ROUND 1: Squirtle vs Pikachu ===");
    console.log("Squirtle HP: ".concat(squirtle.CurrentHP, ", Pikachu HP: ").concat(pikachu.CurrentHP));
    squirtle.Attacks[0].attackAction(pikachu, squirtle); // Water Gun
    pikachu.Attacks[0].attackAction(squirtle, pikachu); // Thundershock
    console.log("\n=== ROUND 2: Wartortle vs Pikachu ===");
    // "Evolve" Squirtle to Wartortle (in real game this would require a card play)
    console.log("Squirtle evolved into Wartortle!");
    wartortle.IsActive = true;
    squirtle.IsActive = false;
    console.log("Wartortle HP: ".concat(wartortle.CurrentHP, ", Pikachu HP: ").concat(pikachu.CurrentHP));
    wartortle.Attacks[1].attackAction(pikachu, wartortle); // Wave Splash
    pikachu.Attacks[0].attackAction(wartortle, pikachu); // Thundershock
    console.log("\n=== ROUND 3: Blastoise vs Pikachu ===");
    // "Evolve" Wartortle to Blastoise
    console.log("Wartortle evolved into Blastoise!");
    blastoise.IsActive = true;
    wartortle.IsActive = false;
    console.log("Blastoise HP: ".concat(blastoise.CurrentHP, ", Pikachu HP: ").concat(pikachu.CurrentHP));
    blastoise.Attacks[0].attackAction(pikachu, blastoise); // Hydro Pump
    // Pikachu faints from the massive damage
    console.log("\n=== BONUS: Blastoise-EX Demonstration ===");
    blastoiseEX.IsActive = true;
    blastoise.IsActive = false;
    var dummyOpponent = new PikachuCard(); // New Pikachu
    dummyOpponent.attachEnergy("electric", 2);
    console.log("Blastoise-EX HP: ".concat(blastoiseEX.CurrentHP));
    blastoiseEX.Attacks[0].attackAction(dummyOpponent, blastoiseEX); // Surf
    blastoiseEX.Attacks[1].attackAction(dummyOpponent, blastoiseEX); // Hydro Bazooka
    console.log("\n=== BATTLE RESULTS ===");
    console.log("- Pikachu was defeated!");
    console.log("- Water Pokémon demonstrated their evolution power!");
    console.log("- Blastoise-EX showed devastating firepower!");
}
// Run the simulation
simulateBattle();
