export class PokedexInfo {
    private _pokedexNumber: number;
    private _height: number; // in meters
    private _weight: number; // in kilograms

    constructor(pokedexNumber: number, height: number, weight: number) {
        this._pokedexNumber = pokedexNumber;
        this._height = height;
        this._weight = weight;
    }

    get pokedexNumber(): number {
        return this._pokedexNumber;
    }

    get height(): number {
        return this._height;
    }

    get weight(): number {
        return this._weight;
    }
}
