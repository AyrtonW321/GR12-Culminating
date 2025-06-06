"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HydroBazooka = exports.Surf = exports.HydroPump = exports.WaveSplash = exports.WaterGun = void 0;
var AttacksClass_js_1 = require("./AttacksClass.js");
var WaterGun = /** @class */ (function (_super) {
    __extends(WaterGun, _super);
    function WaterGun() {
        return _super.call(this, "Water Gun", undefined, 20, 0, ["water", "normal"], [1, 0], 0, "") || this;
    }
    WaterGun.prototype.attackAction = function (defender, attacker) {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Water Gun");
            return false;
        }
        var totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);
        console.log("Water Gun deals ".concat(totalDamage, " damage to ").concat(defender.pokemonName));
        return true;
    };
    return WaterGun;
}(AttacksClass_js_1.Attack));
exports.WaterGun = WaterGun;
var WaveSplash = /** @class */ (function (_super) {
    __extends(WaveSplash, _super);
    function WaveSplash() {
        return _super.call(this, "Wave Splash", undefined, 40, 0, ["water", "normal"], [1, 1], 0, "") || this;
    }
    WaveSplash.prototype.attackAction = function (defender, attacker) {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Wave Splash");
            return false;
        }
        var totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);
        console.log("Wave Splash deals ".concat(totalDamage, " damage to ").concat(defender.pokemonName));
        return true;
    };
    return WaveSplash;
}(AttacksClass_js_1.Attack));
exports.WaveSplash = WaveSplash;
var HydroPump = /** @class */ (function (_super) {
    __extends(HydroPump, _super);
    function HydroPump() {
        return _super.call(this, "Hydro Pump", undefined, 80, 0, ["water", "normal"], [2, 1], 0, "") || this;
    }
    HydroPump.prototype.extraDamage = function (attacker) {
        // Calculate extra water energies beyond 2 required
        var waterIndex = this.EnergyType.indexOf("water");
        if (waterIndex === -1)
            return 0;
        var attachedWater = attacker.getAttachedEnergyAmount("water");
        var requiredWater = this.EnergyCost[waterIndex];
        var extraWater = attachedWater - requiredWater;
        return extraWater >= 2 ? 60 : 0;
    };
    HydroPump.prototype.attackAction = function (defender, attacker) {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Hydro Pump");
            return false;
        }
        var totalDamage = this.Damage + this.extraDamage(attacker);
        totalDamage = this.applyWeaknessBonus(defender, totalDamage);
        defender.applyDamage(totalDamage);
        console.log("Hydro Pump deals ".concat(totalDamage, " damage to ").concat(defender.pokemonName));
        return true;
    };
    return HydroPump;
}(AttacksClass_js_1.Attack));
exports.HydroPump = HydroPump;
var Surf = /** @class */ (function (_super) {
    __extends(Surf, _super);
    function Surf() {
        return _super.call(this, "Surf", undefined, 40, 0, ["water", "normal"], [1, 1], 0, "") || this;
    }
    Surf.prototype.attackAction = function (defender, attacker) {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Surf");
            return false;
        }
        var totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);
        console.log("Surf deals ".concat(totalDamage, " damage to ").concat(defender.pokemonName));
        return true;
    };
    return Surf;
}(AttacksClass_js_1.Attack));
exports.Surf = Surf;
var HydroBazooka = /** @class */ (function (_super) {
    __extends(HydroBazooka, _super);
    function HydroBazooka() {
        return _super.call(this, "Hydro Bazooka", undefined, 100, 0, ["water", "normal"], [2, 1], 0, "") || this;
    }
    HydroBazooka.prototype.extraDamage = function (attacker) {
        // Same logic as Hydro Pump for extra water energy
        var waterIndex = this.EnergyType.indexOf("water");
        if (waterIndex === -1)
            return 0;
        var attachedWater = attacker.getAttachedEnergyAmount("water");
        var requiredWater = this.EnergyCost[waterIndex];
        var extraWater = attachedWater - requiredWater;
        return extraWater >= 2 ? 60 : 0;
    };
    HydroBazooka.prototype.attackAction = function (defender, attacker) {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Hydro Bazooka");
            return false;
        }
        var totalDamage = this.Damage + this.extraDamage(attacker);
        totalDamage = this.applyWeaknessBonus(defender, totalDamage);
        defender.applyDamage(totalDamage);
        console.log("Hydro Bazooka deals ".concat(totalDamage, " damage to ").concat(defender.pokemonName));
        return true;
    };
    return HydroBazooka;
}(AttacksClass_js_1.Attack));
exports.HydroBazooka = HydroBazooka;
