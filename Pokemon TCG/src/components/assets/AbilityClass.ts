// class for all the abilities of pokemons (currently unused as no pokemons has abilities)
export class Ability {
    // stores the name, description of the ability
    private _name: string;
    private _description: string;
    private _canBeUsed: boolean = true;
    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    // getters
    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get canBeUsed(): boolean {
        return this._canBeUsed;
    }

    // setters
    set canBeUsed(value: boolean) {
        this._canBeUsed = value;
    }

    /**
     * Attempts to use the ability
     * 
     * @returns returns false if ability cannot be used, else, return true and logs the ability used
     */
    public abilityAction(): boolean {
        if (!this._canBeUsed) {
            return false;
        }

        console.log(`Used ability: ${this._name} - ${this._description}`);

        return true;
    }

    /**
     * serializes a array class into json string format
     * used to store or transfer the data
     * 
     * @returns returns a plain JS object representing the current state of the class with its properties
     */
    public toJSON() {
        return {
            _name: this._name,
            _description: this._description,
            _canBeUsed: this._canBeUsed,
        };
    }

    /**
     * Recreates an Ability instance from a json object
     *
     * deserializes a plain object, parsed from json
     * into an `Ability` instance by extracting its properties.
     *
     * @param {any} json - the json object containing all the properties of the ability class
     * @returns {Ability} a new ability class with the given properties
     */
    public static fromJSON(json: any): Ability {
        const ability = new Ability(json._name, json._description);
        ability.canBeUsed = json._canBeUsed;
        return ability;
    }
}
