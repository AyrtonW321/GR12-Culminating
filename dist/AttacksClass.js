export class Attack {
    constructor(name, description, damage, damageAddOn, energyType, energyCost, coinflipCount, coinflipMulti) {
        this._name = name;
        this._description = description;
        this._damage = damage;
        this._damageAddOn = damageAddOn;
        this._energyType = energyType;
        this._energyCost = energyCost;
        this._coinflipCount = coinflipCount;
        this._coinflipMulti = coinflipMulti;
    }
    // Getters
    get Name() {
        return this._name;
    }
    get Description() {
        return this._description;
    }
    get Damage() {
        return this._damage;
    }
    get DamageAddOn() {
        return this._damageAddOn;
    }
    get EnergyType() {
        return this._energyType;
    }
    get EnergyCost() {
        return this._energyCost;
    }
    get CoinflipCount() {
        return this._coinflipCount;
    }
    get CoinflipMulti() {
        return this._coinflipMulti;
    }
    flipCoin() {
        return Math.random() < 0.5;
    }
    applyWeaknessBonus(defender, baseDamage) {
        const weaknessChart = {
            normal: [],
            fire: ["grass", "ice", "bug", "steel"],
            water: ["fire", "rock", "ground"],
            electric: ["water", "flying"],
            grass: ["water", "ground", "rock"],
            ice: ["grass", "ground", "flying", "dragon"],
            fighting: ["normal", "ice", "rock", "dark", "steel"],
            poison: ["grass", "fairy"],
            ground: ["fire", "electric", "poison", "rock", "steel"],
            flying: ["grass", "fighting", "bug"],
            psychic: ["fighting", "poison"],
            bug: ["grass", "psychic", "dark"],
            rock: ["fire", "ice", "flying", "bug"],
            ghost: ["psychic", "ghost"],
            dragon: ["dragon"],
            dark: ["psychic", "ghost"],
            steel: ["ice", "rock", "fairy"],
            fairy: ["fighting", "dragon", "dark"],
        };
        const attackerTypes = this.EnergyType.map((type) => type.toLowerCase());
        const defenderType = defender.type.toLowerCase();
        for (let i = 0; i < attackerTypes.length; i++) {
            const attackerType = attackerTypes[i];
            const weaknesses = weaknessChart[attackerType];
            if (weaknesses) {
                for (let j = 0; j < weaknesses.length; j++) {
                    if (weaknesses[j] === defenderType) {
                        return baseDamage + 20;
                    }
                }
            }
        }
        return baseDamage;
    }
}
//# sourceMappingURL=AttacksClass.js.map