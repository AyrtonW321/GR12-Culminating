
// class for the pokedex info of the pokemon, made this instead of using array to store data, easier to access via pokemon.pokedex.height etc
export class PokedexInfo {
    // properties
    private _pokedexNumber: number;
    private _height: number; // in meters
    private _weight: number; // in kilograms

    // constructor
    constructor(pokedexNumber: number, height: number, weight: number) {
        this._pokedexNumber = pokedexNumber;
        this._height = height;
        this._weight = weight;
    }

    // getters
    get pokedexNumber(): number {
        return this._pokedexNumber;
    }

    get height(): number {
        return this._height;
    }

    get weight(): number {
        return this._weight;
    }

    /**
     * serializes a array class into json string format
     * used to store or transfer the data
     * 
     * @returns returns a plain JS object representing the current state of the class with its properties
     */
    public toJSON() {
        return {
            pokedexNumber: this._pokedexNumber ?? 0,
            height: this._height ?? 0,
            weight: this._weight ?? 0,
        };
    }

    /**
     * Recreates an instance from a json object
     *
     * deserializes a plain object, parsed from json
     * into an instance by extracting its properties.
     *
     * @param {any} json - the json object containing all the properties of the ability class
     */
    public static fromJSON(json: any): PokedexInfo {
        return new PokedexInfo(
            (json.pokedexNumber as number) ?? 0,
            (json.height as number) ?? 0,
            (json.weight as number) ?? 0
        );
    }
}
