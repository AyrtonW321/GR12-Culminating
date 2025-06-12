import { PokemonCard } from "./PokemonCardsClass.js";
import {
    VineWhip,
    RazorLeaf,
    MegaDrain,
    GiantBloom,
} from "./AttacksClass.js";
import { PokedexInfo } from "./PokedexInfo.js";

export class BulbasaurCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(1, 0.7, 6.9);
        const attacks = [new VineWhip()];

        super(
            1, // evolutionStage (1 = basic)
            "", // evolvesFrom
            "Bulbasaur", // pokemonName
            false, // isEX
            "grass", // type
            60, // HP
            1, // retreatCost
            "fire", // weakness
            "bulbasaur.png", // pokemonPhoto
            "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.", // description
            1, // rarity
            pokedexInfo,
            attacks,
            undefined
        );
    }

    static fromJSON(json: any): BulbasaurCard {
        return new BulbasaurCard();
    }
}

export class IvysaurCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(2, 1.0, 13.0);
        const attacks = [new RazorLeaf()];

        super(
            2,
            "Bulbasaur",
            "Ivysaur",
            false,
            "grass",
            90,
            2,
            "fire",
            "ivysaur.png",
            "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.",
            2,
            pokedexInfo,
            attacks,
            undefined
        );
    }
    
    static fromJSON(json: any): IvysaurCard {
        return new IvysaurCard();
    }
}

export class VenusaurCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(3, 2.0, 100.0);
        const attacks = [new MegaDrain()];

        super(
            3,
            "Ivysaur",
            "Venusaur",
            false,
            "grass",
            160,
            3,
            "fire",
            "venusaur.png",
            "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.",
            3,
            pokedexInfo,
            attacks,
            undefined
        );
    }

    static fromJSON(json: any): VenusaurCard {
        return new VenusaurCard();
    }
}

export class VenusaurEXCard extends PokemonCard {
    constructor() {
        const pokedexInfo = new PokedexInfo(3, 2.0, 100.0);
        const attacks = [new RazorLeaf(), new GiantBloom()];

        super(
            3,
            "Ivysaur",
            "Venusaur EX",
            true, // isEX
            "grass",
            190,
            3,
            "fire",
            "venusaur_ex.png",
            "A powerful Venusaur that harnesses intense sunlight to deliver devastating attacks and recover strength.",
            4,
            pokedexInfo,
            attacks,
            undefined
        );
    }

    static fromJSON(json: any): VenusaurEXCard {
        return new VenusaurEXCard();
    }
}
