"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = void 0;
var Ability = /** @class */ (function () {
    function Ability(name, description) {
        this._canBeUsed = true;
        this._name = name;
        this._description = description;
    }
    Object.defineProperty(Ability.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ability.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ability.prototype, "canBeUsed", {
        get: function () {
            return this._canBeUsed;
        },
        set: function (value) {
            this._canBeUsed = value;
        },
        enumerable: false,
        configurable: true
    });
    Ability.prototype.abilityAction = function () {
        if (!this._canBeUsed) {
            return false;
        }
        console.log("Used ability: ".concat(this._name, " - ").concat(this._description));
        return true;
    };
    return Ability;
}());
exports.Ability = Ability;
