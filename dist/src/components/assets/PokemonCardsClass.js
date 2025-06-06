export class PokemonCard {
    _evolutionStage;
    _evolvesFrom;
    _pokemonName;
    _isEX;
    _type;
    _HP;
    _pokemonPhoto;
    _attacks;
    _abilities;
    _weakness;
    _retreatCost;
    _rarity;
    _description;
    _pokedexInfo;
    constructor(evoStage, evoFrom, name, ex, type, hp, photo, attacks, weakness, retreatCost, rarity, description, pokedexInfo, ability) {
        this._evolutionStage = evoStage;
        this._evolvesFrom = evoFrom;
        this._pokemonName = name;
        this._isEX = ex;
        this._type = type;
        this._HP = hp;
        this._pokemonPhoto = photo;
        this._attacks = attacks;
        this._abilities = ability;
        this._weakness = weakness;
        this._retreatCost = retreatCost;
        this._rarity = rarity;
        this._description = description;
        this._pokedexInfo = pokedexInfo;
    }
    get evolutionStage() {
        return this._evolutionStage;
    }
    get evolvesFrom() {
        return this._evolvesFrom;
    }
    get pokemonName() {
        return this._pokemonName;
    }
    get isEX() {
        return this._isEX;
    }
    get type() {
        return this._type;
    }
    get HP() {
        return this._HP;
    }
    get pokemonPhoto() {
        return this._pokemonPhoto;
    }
    get attacks() {
        return this._attacks;
    }
    get ability() {
        return this._abilities;
    }
    get weakness() {
        return this._weakness;
    }
    get retreatCost() {
        return this._retreatCost;
    }
    get rarity() {
        return this._rarity;
    }
    get description() {
        return this._description;
    }
    get pokedexInfo() {
        return this._pokedexInfo;
    }
}
//# sourceMappingURL=PokemonCardsClass.js.map