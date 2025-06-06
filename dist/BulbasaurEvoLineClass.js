import { PokemonCard } from "./PokemonCardsClass";
// stats taken from this website: https://www.pokemon-zone.com/sets/a1/
export class BulbasaurCard extends PokemonCard {
    constructor() {
        super(1, "", "Bulbasaur", false, "Grass", 70, "bulbasaur.jpg", [
            {
                name: "Vine Whip",
                description: "",
                damage: 40,
                energyCost: {
                    type1: "Grass",
                    count1: 1,
                    type2: "Normal",
                    count2: 1,
                },
            },
        ], "Fire", 1, 1, "There is a plant seed on its back right from the day this Pokemon is born. The seed slowly grows larger.", { pokedexNumber: 1, height: 0.71, weight: 6.9 });
    }
}
export class IvysaurCard extends PokemonCard {
    constructor() {
        super(2, // evo stage 1
        "Bulbasaur", // evo from
        "Ivysaur", // pokemon name
        false, // is ex
        "Grass", // type
        90, // HP
        "ivysaur.jpg", // pokemonPhoto
        [
            {
                name: "Razor Leaf",
                description: "",
                damage: 60,
                energyCost: {
                    type1: "Grass",
                    count1: 1,
                    type2: "Normal",
                    count2: 2,
                },
            },
        ], "Fire", // weakness
        2, // retreatCost
        2, // rarity
        "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.", {
            pokedexNumber: 2,
            height: 1,
            weight: 13,
        });
    }
}
export class VenusaurCard extends PokemonCard {
    constructor() {
        super(3, // evo stage 2
        "Ivysaur", // evolves from
        "Venusaur", // pokemon name
        false, // is ex
        "Grass", // type
        160, // HP
        "venusaur.jpg", // pokemonPhoto
        [
            {
                name: "Mega Drain",
                description: "Heal 30 damage from this Pokemon",
                damage: 80,
                energyCost: {
                    type1: "Grass",
                    count1: 2,
                    type2: "Normal",
                    count2: 2,
                },
            },
        ], "Fire", 3, 3, "Its plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.", {
            pokedexNumber: 3,
            height: 2,
            weight: 100,
        });
    }
}
export class VenusaurEXCard extends PokemonCard {
    constructor() {
        super(3, // evo stage 2
        "Ivysaur", // evolves from
        "Venusaur EX", // pokemon name
        true, // is ex
        "Grass", // type
        190, // HP
        "venusaurEX.jpg", // pokemonPhoto
        [
            {
                name: "Razor Leaf",
                description: "",
                damage: 60,
                energyCost: {
                    type1: "Grass",
                    count1: 1,
                    type2: "Normal",
                    count2: 2,
                },
            },
            {
                name: "Giant Bloom",
                description: "Heal 30 damage from this Pokemon",
                damage: 100,
                energyCost: {
                    type1: "Grass",
                    count1: 2,
                    type2: "Normal",
                    count2: 2,
                },
            },
        ], "Fire", 3, 4, "Its plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.", {
            pokedexNumber: 3,
            height: 2,
            weight: 100,
        });
    }
}
//# sourceMappingURL=BulbasaurEvoLineClass.js.map