"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCard = void 0;
var PokemonCard = /** @class */ (function () {
    function PokemonCard(evolutionStage, evolvesFrom, pokemonName, isEX, type, HP, retreatCost, weakness, pokemonPhoto, description, rarity, pokedexInfo, attacks, ability, currentHP, boostedStats, activeStatus, attachedEnergyType, attachedEnergyAmount, isActive, isDiscarded, inBench) {
        if (currentHP === void 0) { currentHP = HP; }
        if (boostedStats === void 0) { boostedStats = {
            stat: "",
            amount: 0,
        }; }
        if (activeStatus === void 0) { activeStatus = { statuses: new Set(), poisonCount: 0, burnCount: 0 }; }
        if (attachedEnergyType === void 0) { attachedEnergyType = []; }
        if (attachedEnergyAmount === void 0) { attachedEnergyAmount = []; }
        if (isActive === void 0) { isActive = false; }
        if (isDiscarded === void 0) { isDiscarded = false; }
        if (inBench === void 0) { inBench = true; }
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
    Object.defineProperty(PokemonCard.prototype, "evolutionStage", {
        get: function () {
            return this._evolutionStage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "evolvesFrom", {
        get: function () {
            return this._evolvesFrom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "pokemonName", {
        get: function () {
            return this._pokemonName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "isEX", {
        get: function () {
            return this._isEX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "hp", {
        get: function () {
            return this._HP;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "pokemonPhoto", {
        get: function () {
            return this._pokemonPhoto;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "Attacks", {
        get: function () {
            return this._attacks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "Abilities", {
        get: function () {
            return this._abilities;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "Weakness", {
        get: function () {
            return this._weakness;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "RetreatCost", {
        get: function () {
            return this._retreatCost;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "Rarity", {
        get: function () {
            return this._rarity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "Description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "PokedexInfo", {
        get: function () {
            return this._pokedexInfo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "CurrentHP", {
        get: function () {
            return this._currentHP;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "BoostedStats", {
        get: function () {
            return this._boostedStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "ActiveStatus", {
        get: function () {
            return this._activeStatus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "AttachedEnergyType", {
        get: function () {
            return this._attachedEnergyType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "AttachedEnergyAmount", {
        get: function () {
            return this._attachedEnergyAmount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "IsActive", {
        get: function () {
            return this._isActive;
        },
        set: function (value) {
            this._isActive = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "IsDiscarded", {
        get: function () {
            return this._isDiscarded;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PokemonCard.prototype, "InBench", {
        get: function () {
            return this._inBench;
        },
        enumerable: false,
        configurable: true
    });
    PokemonCard.prototype.checkEnergyRequirements = function (requiredTypes, requiredAmounts) {
        var type1 = requiredTypes[0], type2 = requiredTypes[1];
        var amt1 = requiredAmounts[0], amt2 = requiredAmounts[1];
        var index1 = this._attachedEnergyType.indexOf(type1);
        var index2 = this._attachedEnergyType.indexOf(type2);
        var hasType1 = index1 !== -1 && this._attachedEnergyAmount[index1] >= amt1;
        var hasType2 = index2 !== -1 && this._attachedEnergyAmount[index2] >= amt2;
        return hasType1 && hasType2;
    };
    PokemonCard.prototype.getAttachedEnergyAmount = function (type) {
        var index = this._attachedEnergyType.indexOf(type);
        if (index === -1)
            return 0;
        return this._attachedEnergyAmount[index];
    };
    PokemonCard.prototype.applyDamage = function (amount) {
        this._currentHP = Math.max(0, this._currentHP - amount);
    };
    PokemonCard.prototype.heal = function (amount) {
        this._currentHP = Math.min(this._HP, this._currentHP + amount);
    };
    PokemonCard.prototype.attachEnergy = function (energyType, amount) {
        var index = this._attachedEnergyType.indexOf(energyType);
        if (index !== -1) {
            this._attachedEnergyAmount[index] += amount;
        }
        else {
            this._attachedEnergyType.push(energyType);
            this._attachedEnergyAmount.push(amount);
        }
    };
    PokemonCard.prototype.discardEnergy = function (energyType, amount) {
        var index = this._attachedEnergyType.indexOf(energyType);
        if (index !== -1) {
            this._attachedEnergyAmount[index] = Math.max(0, this._attachedEnergyAmount[index] - amount);
        }
    };
    PokemonCard.prototype.retreat = function () {
        var retreatCost = this._retreatCost;
        if (retreatCost === 0) {
            this._isActive = false;
            this._inBench = true;
            return true;
        }
        var totalEnergy = this._attachedEnergyAmount.reduce(function (sum, amt) { return sum + amt; }, 0);
        if (totalEnergy < retreatCost) {
            // Not enough energy to retreat
            return false;
        }
        var energyToRemove = retreatCost;
        while (energyToRemove > 0) {
            // Find index of energy type with the largest amount
            var maxIndex = 0;
            var maxAmount = this._attachedEnergyAmount[0] || 0;
            for (var i = 1; i < this._attachedEnergyAmount.length; i++) {
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
    };
    PokemonCard.prototype.applyStatusCondition = function (condition) {
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
            var statusesArray = Array.from(PokemonCard.nonStackableStatuses);
            for (var i = 0; i < statusesArray.length; i++) {
                var status_1 = statusesArray[i];
                if (this._activeStatus.statuses.has(status_1)) {
                    this._activeStatus.statuses.delete(status_1);
                }
            }
            this._activeStatus.statuses.add(condition);
            return;
        }
        // For any other conditions not recognized, just add once
        this._activeStatus.statuses.add(condition);
    };
    PokemonCard.prototype.clearStatusCondition = function (condition) {
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
    };
    PokemonCard.prototype.getActiveStatuses = function () {
        return Array.from(this._activeStatus.statuses);
    };
    PokemonCard.prototype.getPoisonCount = function () {
        return this._activeStatus.poisonCount;
    };
    PokemonCard.prototype.getBurnCount = function () {
        return this._activeStatus.burnCount;
    };
    // set over array as sets cannot have duplicates, and has more straightforward functions .add, .deleat etc
    PokemonCard.nonStackableStatuses = new Set([
        "ASLEEP",
        "PARALYZED",
        "CONFUSED",
    ]);
    return PokemonCard;
}());
exports.PokemonCard = PokemonCard;
