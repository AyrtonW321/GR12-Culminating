export class PokemonCard {
    constructor(evolutionStage, evolvesFrom, pokemonName, isEX, type, HP, retreatCost, weakness, pokemonPhoto, description, rarity, pokedexInfo, attacks, ability, currentHP = HP, boostedStats = {
        stat: "",
        amount: 0,
    }, activeStatus = { statuses: new Set(), poisonCount: 0, burnCount: 0 }, attachedEnergyType = [], attachedEnergyAmount = [], isActive = false, isDiscarded = false, inBench = true) {
        this._evolutionStage = evolutionStage;
        this._evolvesFrom = evolvesFrom;
        this._pokemonName = pokemonName;
        this._isEX = isEX;
        this._type = type;
        this._HP = HP;
        this._pokemonPhoto = pokemonPhoto;
        this._attacks = attacks;
        this._abilities = ability;
        this._weakness = weakness;
        this._retreatCost = retreatCost;
        this._rarity = rarity;
        this._description = description;
        this._pokedexInfo = pokedexInfo;
        this._currentHP = currentHP;
        this._boostedStats = boostedStats;
        this._activeStatus = {
            statuses: activeStatus.statuses || new Set(),
            poisonCount: activeStatus.poisonCount || 0,
            burnCount: activeStatus.burnCount || 0,
        };
        this._attachedEnergyType = attachedEnergyType;
        this._attachedEnergyAmount = attachedEnergyAmount;
        this._isActive = isActive;
        this._isDiscarded = isDiscarded;
        this._inBench = inBench;
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
    get hp() {
        return this._HP;
    }
    get pokemonPhoto() {
        return this._pokemonPhoto;
    }
    get Attacks() {
        return this._attacks;
    }
    get Abilities() {
        return this._abilities;
    }
    get Weakness() {
        return this._weakness;
    }
    get RetreatCost() {
        return this._retreatCost;
    }
    get Rarity() {
        return this._rarity;
    }
    get Description() {
        return this._description;
    }
    get PokedexInfo() {
        return this._pokedexInfo;
    }
    get CurrentHP() {
        return this._currentHP;
    }
    get BoostedStats() {
        return this._boostedStats;
    }
    get ActiveStatus() {
        return this._activeStatus;
    }
    get AttachedEnergyType() {
        return this._attachedEnergyType;
    }
    get AttachedEnergyAmount() {
        return this._attachedEnergyAmount;
    }
    get IsActive() {
        return this._isActive;
    }
    set IsActive(value) {
        this._isActive = value;
    }
    get IsDiscarded() {
        return this._isDiscarded;
    }
    get InBench() {
        return this._inBench;
    }
    checkEnergyRequirements(requiredTypes, requiredAmounts) {
        const [type1, type2] = requiredTypes;
        const [amt1, amt2] = requiredAmounts;
        const index1 = this._attachedEnergyType.indexOf(type1);
        const index2 = this._attachedEnergyType.indexOf(type2);
        const hasType1 = index1 !== -1 && this._attachedEnergyAmount[index1] >= amt1;
        const hasType2 = index2 !== -1 && this._attachedEnergyAmount[index2] >= amt2;
        return hasType1 && hasType2;
    }
    getAttachedEnergyAmount(type) {
        const index = this._attachedEnergyType.indexOf(type);
        if (index === -1)
            return 0;
        return this._attachedEnergyAmount[index];
    }
    applyDamage(amount) {
        this._currentHP = Math.max(0, this._currentHP - amount);
    }
    heal(amount) {
        this._currentHP = Math.min(this._HP, this._currentHP + amount);
    }
    attachEnergy(energyType, amount) {
        const index = this._attachedEnergyType.indexOf(energyType);
        if (index !== -1) {
            this._attachedEnergyAmount[index] += amount;
        }
        else {
            this._attachedEnergyType.push(energyType);
            this._attachedEnergyAmount.push(amount);
        }
    }
    discardEnergy(energyType, amount) {
        const index = this._attachedEnergyType.indexOf(energyType);
        if (index !== -1) {
            this._attachedEnergyAmount[index] = Math.max(0, this._attachedEnergyAmount[index] - amount);
        }
    }
    retreat() {
        const retreatCost = this._retreatCost;
        if (retreatCost === 0) {
            this._isActive = false;
            this._inBench = true;
            return true;
        }
        const totalEnergy = this._attachedEnergyAmount.reduce((sum, amt) => sum + amt, 0);
        if (totalEnergy < retreatCost) {
            // Not enough energy to retreat
            return false;
        }
        let energyToRemove = retreatCost;
        while (energyToRemove > 0) {
            // Find index of energy type with the largest amount
            let maxIndex = 0;
            let maxAmount = this._attachedEnergyAmount[0] || 0;
            for (let i = 1; i < this._attachedEnergyAmount.length; i++) {
                if ((this._attachedEnergyAmount[i] || 0) > maxAmount) {
                    maxAmount = this._attachedEnergyAmount[i];
                    maxIndex = i;
                }
            }
            if (maxAmount <= energyToRemove) {
                // Remove all energy of this type
                energyToRemove -= maxAmount;
                this._attachedEnergyAmount[maxIndex] = 0;
            }
            else {
                // Remove only needed amount
                this._attachedEnergyAmount[maxIndex] -= energyToRemove;
                energyToRemove = 0;
            }
        }
        this._isActive = false;
        this._inBench = true;
        return true;
    }
    applyStatusCondition(condition) {
        condition = condition.toUpperCase();
        if (condition === "NONE") {
            this.clearStatusCondition();
            return;
        }
        if (condition === "POISONED") {
            // Stack poison: increment poisonCount
            this._activeStatus.poisonCount++;
            this._activeStatus.statuses.add("POISONED");
            return;
        }
        if (condition === "BURNED") {
            // Stack burn damage count
            this._activeStatus.burnCount++;
            this._activeStatus.statuses.add("BURNED");
            return;
        }
        if (PokemonCard.nonStackableStatuses.has(condition)) {
            // Remove any non-stackable status currently active before adding new one
            // change a set to an array
            const statusesArray = Array.from(PokemonCard.nonStackableStatuses);
            for (let i = 0; i < statusesArray.length; i++) {
                const status = statusesArray[i];
                if (this._activeStatus.statuses.has(status)) {
                    this._activeStatus.statuses.delete(status);
                }
            }
            this._activeStatus.statuses.add(condition);
            return;
        }
        // For any other conditions not recognized, just add once
        this._activeStatus.statuses.add(condition);
    }
    clearStatusCondition(condition) {
        if (!condition || condition.toUpperCase() === "NONE") {
            // Clear all statuses
            if (this._activeStatus.statuses.size > 0) {
                this._activeStatus.statuses.clear();
                this._activeStatus.poisonCount = 0;
                this._activeStatus.burnCount = 0;
                return true;
            }
            return false;
        }
        condition = condition.toUpperCase();
        if (condition === "POISONED") {
            if (this._activeStatus.poisonCount > 0) {
                this._activeStatus.poisonCount--;
                if (this._activeStatus.poisonCount === 0) {
                    this._activeStatus.statuses.delete("POISONED");
                }
                return true;
            }
            return false;
        }
        if (condition === "BURNED") {
            if (this._activeStatus.burnCount > 0) {
                this._activeStatus.burnCount--;
                if (this._activeStatus.burnCount === 0) {
                    this._activeStatus.statuses.delete("BURNED");
                }
                return true;
            }
            return false;
        }
        if (this._activeStatus.statuses.has(condition)) {
            this._activeStatus.statuses.delete(condition);
            return true;
        }
        return false;
    }
    getActiveStatuses() {
        return Array.from(this._activeStatus.statuses);
    }
    getPoisonCount() {
        return this._activeStatus.poisonCount;
    }
    getBurnCount() {
        return this._activeStatus.burnCount;
    }
}
// set over array as sets cannot have duplicates, and has more straightforward functions .add, .deleat etc
PokemonCard.nonStackableStatuses = new Set([
    "ASLEEP",
    "PARALYZED",
    "CONFUSED",
]);
//# sourceMappingURL=PokemonCardsClass.js.map