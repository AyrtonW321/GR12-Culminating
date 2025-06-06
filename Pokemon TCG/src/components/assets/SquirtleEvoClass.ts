import { PokedexInfo } from "./PokedexInfo.js";
import { WaterGun, WaveSplash, HydroPump, HydroBazooka, Surf } from "./WaterAttacksClass.js";
import { PokemonCard } from "./PokemonCardsClass.js";

export class SquirtleCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(7, 0.5, 9.0);
        const waterGun = new WaterGun();

        super(
            1,                      // evolutionStage
            "",                     // evolvesFrom)
            "Squirtle",             // pokemonName
            false,                  // isEX
            "water",                // type
            60,                     // HP
            1,                      // retreatCost
            "electric",             // weakness
            "squirtle.png",         // pokemonPhoto
            "When it retracts its long neck into its shell, it squirts out water with vigorous force.", // description
            1,                      // rarity
            pokedexInfo,            // pokedexInfo
            [waterGun],       // attacks
            undefined               // ability 
        );
    }
}

export class WartortleCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(8, 1.0, 22.5);
        const attacks = [new WaterGun(), new WaveSplash()];

        super(
            2,                      // evolutionStage (2 for stage 1)
            "Squirtle",             // evolvesFrom
            "Wartortle",            // pokemonName
            false,                  // isEX
            "water",                // type
            80,                     // HP
            1,                      // retreatCost
            "electric",             // weakness
            "wartortle.png",        // pokemonPhoto
            "Its tail is large and covered with rich fur. It becomes more powerful when wet.", // description
            2,                      // rarity
            pokedexInfo,            // pokedexInfo
            attacks,                // attacks
            undefined               // ability
        );
    }
}

export class BlastoiseCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(9, 1.6, 85.5);
        const attacks = [new HydroPump()];

        super(
            3,                      // evolutionStage (3 for stage 2)
            "Wartortle",            // evolvesFrom
            "Blastoise",            // pokemonName
            false,                  // isEX
            "water",                // type
            150,                    // HP
            3,                      // retreatCost
            "electric",            // weakness
            "blastoise.png",       // pokemonPhoto
            "The pressurized water jets on this brutal Pokémon's shell are used for high-speed charges.", // description
            3,                      // rarity
            pokedexInfo,            // pokedexInfo
            attacks,                // attacks
            undefined              // ability
        );
    }
}

export class BlastoiseEXCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(9, 1.6, 85.5); // Same as regular Blastoise
        const attacks = [new Surf(), new HydroBazooka()];

        super(
            3,                      // evolutionStage (3 for stage 2)
            "Wartortle",            // evolvesFrom
            "Blastoise-EX",         // pokemonName
            true,                   // isEX (true for EX cards)
            "water",                // type
            180,                    // HP (higher for EX)
            4,                      // retreatCost (higher for EX)
            "electric",             // weakness
            "blastoise-ex.png",     // pokemonPhoto
            "EX version of Blastoise with devastating water attacks.", // description
            4,                      // rarity (higher for EX)
            pokedexInfo,            // pokedexInfo
            attacks,                // attacks
            undefined               // ability
        );
    }
}