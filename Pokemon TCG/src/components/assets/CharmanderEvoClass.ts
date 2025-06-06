import { PokemonCard } from "./PokemonCardsClass.js";
import { Ember, FireClaws, Slash, CrimsonStorm, FireSpin } from "./FireAttacksClass.js";
import { PokedexInfo } from "./PokedexInfo.js";

export class CharmanderCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(4, 0.6, 8.5);
        const attacks = [new Ember()];

        super(
            1,                      // evolutionStage (1 for basic)
            "",                     // evolvesFrom
            "Charmander",           // pokemonName
            false,                  // isEX
            "fire",                 // type
            60,                     // HP
            1,                      // retreatCost
            "water",                // weakness
            "charmander.png",       // pokemonPhoto
            "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.", // description
            1,                      // rarity
            pokedexInfo,           // pokedexInfo
            attacks,               // attacks
            undefined              // ability
        );
    }
}

export class CharmeleonCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(5, 1.1, 19.0);
        const attacks = [new FireClaws()];

        super(
            2,                      // evolutionStage
            "Charmander",           // evolvesFrom
            "Charmeleon",           // pokemonName
            false,                  // isEX
            "fire",                 // type
            90,                     // HP
            2,                      // retreatCost
            "water",                // weakness
            "charmeleon.png",       // pokemonPhoto
            "When it swings its burning tail, it elevates the temperature to unbearably high levels.", // description
            2,                      // rarity
            pokedexInfo,           // pokedexInfo
            attacks,               // attacks
            undefined              // ability
        );
    }
}


export class CharizardCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(6, 1.7, 90.5);
        const attacks = [new FireSpin()];

        super(
            3,                      // evolutionStage
            "Charmeleon",           // evolvesFrom
            "Charizard",            // pokemonName
            false,                  // isEX
            "fire",                 // type
            150,                    // HP
            3,                      // retreatCost
            "water",                // weakness
            "charizard.png",        // pokemonPhoto
            "Spits fire that is hot enough to melt boulders. Known to unintentionally cause forest fires.", // description
            3,                      // rarity
            pokedexInfo,           // pokedexInfo
            attacks,               // attacks
            undefined              // ability
        );
    }
}


export class CharizardEXCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(6, 1.7, 90.5);
        const attacks = [new Slash(), new CrimsonStorm()];

        super(
            3,                      // evolutionStage
            "Charmeleon",           // evolvesFrom
            "Charizard EX",         // pokemonName
            true,                   // isEX
            "fire",                 // type
            180,                    // HP
            3,                      // retreatCost
            "water",                // weakness
            "charizard_ex.png",     // pokemonPhoto
            "A powerful and rare Charizard form that unleashes extreme firepower at the cost of heavy energy.", // description
            4,                      // rarity
            pokedexInfo,           // pokedexInfo
            attacks,               // attacks
            undefined              // ability
        );
    }
}
