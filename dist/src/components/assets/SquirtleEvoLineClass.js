import { PokemonCard } from "./PokemonCardsClass";
export class SquirtleCard extends PokemonCard {
    constructor() {
        super(1, // evolutionStage
        "", // evolvesFrom
        "Squirtle", // pokemonName
        false, // isEX
        "Water", // type
        60, // HP
        "squirtle.jpg", // pokemonPhoto
        [
            {
                name: "Water Gun",
                description: "",
                damage: 20,
                energyCost: {
                    type1: "Water",
                    count1: 1,
                },
            },
        ], "Electric", // weakness
        1, // retreatCost
        1, // rarity
        "When it retracts its long neck into its shell, it squirts out water with vigorous force.", {
            pokedexNumber: 7,
            height: 0.5,
            weight: 9,
        });
    }
}
export class WartortleCard extends PokemonCard {
    constructor() {
        super(2, // evolutionStage
        "Squirtle", // evolvesFrom
        "Wartortle", // pokemonName
        false, // isEX
        "Water", // type
        80, // HP
        "wartortle.jpg", // pokemonPhoto
        [
            {
                name: "Wave Splash",
                description: "",
                damage: 40,
                energyCost: {
                    type1: "Water",
                    count1: 1,
                    type2: "Normal",
                    count2: 1,
                },
            },
        ], "Electric", // weakness
        1, // retreatCost
        2, // rarity
        "It is recognized as a symbol of longevity. If its shell has algae on it, that Wartortle is very old.", {
            pokedexNumber: 8,
            height: 1.0,
            weight: 18.4,
        });
    }
}
export class BlastoiseCard extends PokemonCard {
    constructor() {
        super(3, // evolutionStage
        "Wartortle", // evolvesFrom
        "Blastoise", // pokemonName
        false, // isEX
        "Water", // type
        150, // HP
        "blastoise.jpg", // pokemonPhoto
        [
            {
                name: "Hydro Pump",
                description: "If this Pokemon has at least 2 extra Water Energy attached, this attack does 60 more damage",
                damage: 80,
                energyCost: {
                    type1: "Water",
                    count1: 2,
                    type2: "Normal",
                    count2: 1,
                },
            },
        ], "Electric", // weakness
        3, // retreatCost
        3, // rarity
        "It crushes its foe under its heavy body to cause fainting. In a pinch, it will withdraw inside its shell.", {
            pokedexNumber: 9,
            height: 1.6,
            weight: 85.5,
        });
    }
}
export class BlastoiseEXCard extends PokemonCard {
    constructor() {
        super(3, // evolutionStage
        "Wartortle", // evolvesFrom
        "Blastoise EX", // pokemonName
        true, // isEX
        "Water", // type
        180, // HP
        "blastoiseEX.jpg", // pokemonPhoto
        [
            {
                name: "Surf",
                description: "",
                damage: 40,
                energyCost: {
                    type1: "Water",
                    count1: 1,
                    type2: "Normal",
                    count2: 1,
                },
            },
            {
                name: "Hydro Bazooka",
                description: "If this Pokemon has at least 2 extra Water Energy attached, this attack does 60 more damage",
                damage: 100,
                energyCost: {
                    type1: "Water",
                    count1: 2,
                    type2: "Normal",
                    count2: 1,
                },
            },
        ], "Electric", // weakness
        3, // retreatCost
        4, // rarity
        "It crushes its foe under its heavy body to cause fainting. In a pinch, it will withdraw inside its shell.", {
            pokedexNumber: 9,
            height: 1.6,
            weight: 85.5,
        });
    }
}
//# sourceMappingURL=SquirtleEvoLineClass.js.map