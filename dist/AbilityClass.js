export class Ability {
    constructor(name, description) {
        this._canBeUsed = true;
        this._name = name;
        this._description = description;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get canBeUsed() {
        return this._canBeUsed;
    }
    set canBeUsed(value) {
        this._canBeUsed = value;
    }
    abilityAction() {
        if (!this._canBeUsed) {
            return false;
        }
        console.log(`Used ability: ${this._name} - ${this._description}`);
        return true;
    }
}
//# sourceMappingURL=AbilityClass.js.map