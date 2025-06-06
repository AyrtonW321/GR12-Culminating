export class Ability {
    private _name: string;
    private _description: string;
    private _canBeUsed: boolean = true;
    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get canBeUsed(): boolean {
        return this._canBeUsed;
    }
    set canBeUsed(value: boolean) {
        this._canBeUsed = value;
    }

    abilityAction(): boolean {
        if (!this._canBeUsed) {
            return false;
        }

        console.log(`Used ability: ${this._name} - ${this._description}`);

        return true;
    }
}
