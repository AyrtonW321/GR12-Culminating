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
exports.BlastoiseEXCard = exports.BlastoiseCard = exports.WartortleCard = exports.SquirtleCard = void 0;
var PokedexInfo_js_1 = require("../Attack Classes/PokedexInfo.js");
var WaterAttacksClass_js_1 = require("../Attack Classes/WaterAttacksClass.js");
var PokemonCardsClass_js_1 = require("../Attack Classes/PokemonCardsClass.js");
var SquirtleCard = /** @class */ (function (_super) {
    __extends(SquirtleCard, _super);
    function SquirtleCard() {
        var pokedexInfo = new PokedexInfo_js_1.PokedexInfo(7, 0.5, 9.0);
        var waterGun = new WaterAttacksClass_js_1.WaterGun();
        return _super.call(this, 1, // evolutionStage
        "", // evolvesFrom)
        "Squirtle", // pokemonName
        false, // isEX
        "water", // type
        60, // HP
        1, // retreatCost
        "electric", // weakness
        "squirtle.png", // pokemonPhoto
        "When it retracts its long neck into its shell, it squirts out water with vigorous force.", // description
        1, // rarity
        pokedexInfo, // pokedexInfo
        [waterGun], // attacks
        undefined // ability 
        ) || this;
    }
    return SquirtleCard;
}(PokemonCardsClass_js_1.PokemonCard));
exports.SquirtleCard = SquirtleCard;
var WartortleCard = /** @class */ (function (_super) {
    __extends(WartortleCard, _super);
    function WartortleCard() {
        var pokedexInfo = new PokedexInfo_js_1.PokedexInfo(8, 1.0, 22.5);
        var attacks = [new WaterAttacksClass_js_1.WaterGun(), new WaterAttacksClass_js_1.WaveSplash()];
        return _super.call(this, 2, // evolutionStage (2 for stage 1)
        "Squirtle", // evolvesFrom
        "Wartortle", // pokemonName
        false, // isEX
        "water", // type
        80, // HP
        1, // retreatCost
        "electric", // weakness
        "wartortle.png", // pokemonPhoto
        "Its tail is large and covered with rich fur. It becomes more powerful when wet.", // description
        2, // rarity
        pokedexInfo, // pokedexInfo
        attacks, // attacks
        undefined // ability
        ) || this;
    }
    return WartortleCard;
}(PokemonCardsClass_js_1.PokemonCard));
exports.WartortleCard = WartortleCard;
var BlastoiseCard = /** @class */ (function (_super) {
    __extends(BlastoiseCard, _super);
    function BlastoiseCard() {
        var pokedexInfo = new PokedexInfo_js_1.PokedexInfo(9, 1.6, 85.5);
        var attacks = [new WaterAttacksClass_js_1.HydroPump()];
        return _super.call(this, 3, // evolutionStage (3 for stage 2)
        "Wartortle", // evolvesFrom
        "Blastoise", // pokemonName
        false, // isEX
        "water", // type
        150, // HP
        3, // retreatCost
        "electric", // weakness
        "blastoise.png", // pokemonPhoto
        "The pressurized water jets on this brutal Pokémon's shell are used for high-speed charges.", // description
        3, // rarity
        pokedexInfo, // pokedexInfo
        attacks, // attacks
        undefined // ability
        ) || this;
    }
    return BlastoiseCard;
}(PokemonCardsClass_js_1.PokemonCard));
exports.BlastoiseCard = BlastoiseCard;
var BlastoiseEXCard = /** @class */ (function (_super) {
    __extends(BlastoiseEXCard, _super);
    function BlastoiseEXCard() {
        var pokedexInfo = new PokedexInfo_js_1.PokedexInfo(9, 1.6, 85.5); // Same as regular Blastoise
        var attacks = [new WaterAttacksClass_js_1.Surf(), new WaterAttacksClass_js_1.HydroBazooka()];
        return _super.call(this, 3, // evolutionStage (3 for stage 2)
        "Wartortle", // evolvesFrom
        "Blastoise-EX", // pokemonName
        true, // isEX (true for EX cards)
        "water", // type
        180, // HP (higher for EX)
        4, // retreatCost (higher for EX)
        "electric", // weakness
        "blastoise-ex.png", // pokemonPhoto
        "EX version of Blastoise with devastating water attacks.", // description
        4, // rarity (higher for EX)
        pokedexInfo, // pokedexInfo
        attacks, // attacks
        undefined // ability
        ) || this;
    }
    return BlastoiseEXCard;
}(PokemonCardsClass_js_1.PokemonCard));
exports.BlastoiseEXCard = BlastoiseEXCard;
