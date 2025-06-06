"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokedexInfo = void 0;
var PokedexInfo = /** @class */ (function () {
    function PokedexInfo(pokedexNumber, height, weight) {
        this._pokedexNumber = pokedexNumber;
        this._height = height;
        this._weight = weight;
    }
    Object.defineProperty(PokedexInfo.prototype, "pokedexNumber", {
        get: function () {
            return this._pokedexNumber;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokedexInfo.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokedexInfo.prototype, "weight", {
        get: function () {
            return this._weight;
        },
        enumerable: false,
        configurable: true
    });
    return PokedexInfo;
}());
exports.PokedexInfo = PokedexInfo;
