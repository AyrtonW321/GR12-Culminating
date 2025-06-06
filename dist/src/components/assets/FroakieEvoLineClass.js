import { PokemonCard } from "./PokemonCardsClass";
export class FroakieCard extends PokemonCard {
    constructor() {
        super(1, // evolutionStage
        "", // evolvesFrom
        "Froakie", // pokemonName
        false, // isEX
        "Water", // type
        60, // HP
        "froakie.jpg", // pokemonPhoto
        [
            {
                name: "Flop",
                description: "",
                damage: 10,
                energyCost: {
                    type1: "Normal",
                    count1: 1,
                },
            },
        ], "Electric", // weakness
        1, // retreatCost
        1, // rarity
        "It secretes flexible bubbles from its chest and back. The bubbles reduce the damage it would otherwise take.", {
            pokedexNumber: 656,
            height: 0.3,
            weight: 7.0,
        });
    }
}
export class FrogadierCard extends PokemonCard {
    constructor() {
        super(2, // evolutionStage
        "Froakie", // evolvesFrom
        "Frogadier", // pokemonName
        false, // isEX
        "Water", // type
        80, // HP
        "frogadier.jpg", // pokemonPhoto
        [
            {
                name: "Water Drip",
                description: "",
                damage: 30,
                energyCost: {
                    type1: "Normal",
                    count1: 1,
                },
            },
        ], "Electric", // weakness
        1, // retreatCost
        2, // rarity
        "It can throw bubble-covered pebbles with precise control to hit targets behind cover.", {
            pokedexNumber: 657,
            height: 0.6,
            weight: 10.9,
        });
    }
}
export class GreninjaCard extends PokemonCard {
    constructor() {
        super(3, // evolutionStage
        "Frogadier", // evolvesFrom
        "Greninja", // pokemonName
        false, // isEX
        "Water", // type
        120, // HP
        "greninja.jpg", // pokemonPhoto
        [
            {
                name: "Mist Slash",
                description: "",
                damage: 60,
                energyCost: {
                    type1: "Water",
                    count1: 1,
                    type2: "Normal",
                    count2: 1,
                },
            },
        ], "Electric", // weakness
        1, // retreatCost
        3, // rarity
        "It creates throwing stars out of compressed water. When it spins them and throws them at high speed, these stars can split metal in two.", {
            pokedexNumber: 658,
            height: 1.5,
            weight: 37.3,
        }, {
            name: "Water Shuriken",
            description: "Once during your turn, you may do 20 damage to 1 of your opponent's Pokémon",
        });
    }
}
//# sourceMappingURL=FroakieEvoLineClass.js.map