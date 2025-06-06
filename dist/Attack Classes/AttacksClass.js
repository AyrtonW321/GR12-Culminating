"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attack = void 0;
var Attack = /** @class */ (function () {
    function Attack(name, description, damage, damageAddOn, energyType, energyCost, coinflipCount, coinflipMulti) {
        this._name = name;
        this._description = description;
        this._damage = damage;
        this._damageAddOn = damageAddOn;
        this._energyType = energyType;
        this._energyCost = energyCost;
        this._coinflipCount = coinflipCount;
        this._coinflipMulti = coinflipMulti;
    }
    Object.defineProperty(Attack.prototype, "Name", {
        // Getters
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attack.prototype, "Description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attack.prototype, "Damage", {
        get: function () {
            return this._damage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attack.prototype, "DamageAddOn", {
        get: function () {
            return this._damageAddOn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attack.prototype, "EnergyType", {
        get: function () {
            return this._energyType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attack.prototype, "EnergyCost", {
        get: function () {
            return this._energyCost;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attack.prototype, "CoinflipCount", {
        get: function () {
            return this._coinflipCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attack.prototype, "CoinflipMulti", {
        get: function () {
            return this._coinflipMulti;
        },
        enumerable: false,
        configurable: true
    });
    Attack.prototype.flipCoin = function () {
        return Math.random() < 0.5;
    };
    Attack.prototype.applyWeaknessBonus = function (defender, baseDamage) {
        var weaknessChart = {
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
        var attackerTypes = this.EnergyType.map(function (type) { return type.toLowerCase(); });
        var defenderType = defender.type.toLowerCase();
        for (var _i = 0, attackerTypes_1 = attackerTypes; _i < attackerTypes_1.length; _i++) {
            var attackerType = attackerTypes_1[_i];
            var weaknesses = weaknessChart[attackerType];
            if (weaknesses && weaknesses.includes(defenderType)) {
                return baseDamage + 20;
            }
        }
        return baseDamage;
    };
    return Attack;
}());
exports.Attack = Attack;
