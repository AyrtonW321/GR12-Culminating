import { PokemonCard } from "./PokemonCardsClass";
// stats taken from this website: https://www.pokemon-zone.com/sets/a1/
export class CharmanderCard extends PokemonCard {
    constructor() {
        super(1, "", "Charmander", false, "Fire", 60, "charmander.jpg", [
            {
                name: "Ember",
                description: "Discard a fire energy from this pokemon.",
                damage: 30,
                energyCost: {
                    type1: "Fire",
                    count1: 1,
                },
            },
        ], "Water", 1, // retreatCost
        1, // rarity
        "The flame on its tail shows the strength of its life-force. If Charmander is weak, the flame also burns weakly.", { pokedexNumber: 4, height: 0.61, weight: 8.5 });
    }
}
export class CharmeleonCard extends PokemonCard {
    constructor() {
        super(2, // evo stage 1
        "Charmander", // evo from
        "Charmeleon", // pokemon name
        false, // is ex
        "Fire", // type
        90, // HP
        "charmeleon.jpg", // pokemonPhoto
        [
            {
                name: "Fire Claws",
                description: "",
                damage: 60,
                energyCost: {
                    type1: "Fire",
                    count1: 1,
                    type2: "Normal",
                    count2: 2,
                },
            },
        ], "Water", // weakness
        2, // retreatCost
        2, // rarity
        "When it swings its burning tail, the temperature around it rises higher and higher, tormenting its opponents.", {
            pokedexNumber: 5,
            height: 1.1,
            weight: 19,
        });
    }
}
export class CharizardCard extends PokemonCard {
    constructor() {
        super(3, // evo stage 2
        "Charmeleon", // evolves from
        "Charizard", // pokemon name
        false, // is ex
        "Fire", // type
        150, // HP
        "charizard.jpg", // pokemonPhoto
        [
            {
                name: "Fire Spin",
                description: "Discard 2 fire energy from this pokemon",
                damage: 150,
                energyCost: {
                    type1: "Fire",
                    count1: 2,
                    type2: "Normal",
                    count2: 2,
                },
            },
        ], "Water", 2, 3, "If Charizard becomes truly angered, the flame at the tip of its tail burns in a light blue shade.", {
            pokedexNumber: 6,
            height: 1.7,
            weight: 90.5,
        });
    }
}
export class CharizardEXCard extends PokemonCard {
    constructor() {
        super(3, // evo stage 2
        "Charmeleon", // evolves from
        "Charizard EX", // pokemon name
        true, // is ex
        "Fire", // type
        180, // HP
        "charizardEX.jpg", // pokemonPhoto
        [
            {
                name: "Slash",
                description: "",
                damage: 60,
                energyCost: {
                    type1: "Fire",
                    count1: 1,
                    type2: "Normal",
                    count2: 2,
                },
            },
            {
                name: "Crimson Storm",
                description: "Discard 2 fire energy from this pokemon",
                damage: 200,
                energyCost: {
                    type1: "Fire",
                    count1: 2,
                    type2: "Normal",
                    count2: 2,
                },
            },
        ], "Water", 2, 4, "If Charizard becomes truly angered, the flame at the tip of its tail burns in a light blue shade.", {
            pokedexNumber: 6,
            height: 1.7,
            weight: 90.5,
        });
    }
}
//# sourceMappingURL=CharmanderEvoLineClass.js.map