import { PokemonCard } from "./PokemonCardsClass.js";

export abstract class Attack {
    private _name: string;
    private _description?: string;
    private _damage: number;
    private _damageAddOn: number;
    private _energyType: [string, string];
    private _energyCost: [number, number];
    private _coinflipCount: number;
    private _coinflipMulti: string;

    constructor(
        name: string,
        description: string | undefined,
        damage: number,
        damageAddOn: number,
        energyType: [string, string],
        energyCost: [number, number],
        coinflipCount: number,
        coinflipMulti: string
    ) {
        this._name = name;
        this._description = description;
        this._damage = damage;
        this._damageAddOn = damageAddOn;
        this._energyType = energyType;
        this._energyCost = energyCost;
        this._coinflipCount = coinflipCount;
        this._coinflipMulti = coinflipMulti;
    }

    get Name(): string {
        return this._name;
    }

    get Description(): string | undefined {
        return this._description;
    }

    get Damage(): number {
        return this._damage;
    }

    get DamageAddOn(): number {
        return this._damageAddOn;
    }

    get EnergyType(): [string, string] {
        return this._energyType;
    }

    get EnergyCost(): [number, number] {
        return this._energyCost;
    }

    get CoinflipCount(): number {
        return this._coinflipCount;
    }

    get CoinflipMulti(): string {
        return this._coinflipMulti;
    }

    public flipCoin(): boolean {
        return Math.random() < 0.5;
    }

    public applyWeaknessBonus(
        defender: PokemonCard,
        baseDamage: number
    ): number {
        const weaknessChart: Record<string, string[]> = {
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

    public abstract attackAction(
        defender: PokemonCard,
        attacker: PokemonCard
    ): boolean;

    public toJSON() {
        return {
            type: this.constructor.name,
            name: this._name,
            description: this._description,
            damage: this._damage,
            damageAddOn: this._damageAddOn,
            energyType: this._energyType,
            energyCost: this._energyCost,
            coinflipCount: this._coinflipCount,
            coinflipMulti: this._coinflipMulti,
        };
    }

    static fromJSON(json: any): Attack {
        switch (json.type) {
            case "Ember":
                return new Ember();
            case "FireClaws":
                return new FireClaws();
            case "FireSpin":
                return new FireSpin();
            case "Slash":
                return new Slash();
            case "CrimsonStorm":
                return new CrimsonStorm();
            case "VineWhip":
                return new VineWhip();
            case "RazorLeaf":
                return new RazorLeaf();
            case "MegaDrain":
                return new MegaDrain();
            case "GiantBloom":
                return new GiantBloom();
            case "WaterGun":
                return new WaterGun();
            case "HydroBazooka":
                return new HydroBazooka();
            case "HydroPump":
                return new HydroPump();
            case "Surf":
                return new Surf();
            case "WaveSplash":
                return new WaveSplash();
            default:
                return new (class extends Attack {
                    attackAction(): boolean {
                        console.log("No action defined for generic Attack");
                        return false;
                    }
                })(
                    json.name,
                    json.description,
                    json.damage,
                    json.damageAddOn,
                    json.energyType,
                    json.energyCost,
                    json.coinflipCount,
                    json.coinflipMulti
                );
        }
    }
}

export class Ember extends Attack {
    constructor() {
        super(
            "Ember",
            "Discard a Fire energy from this Pokémon.",
            30,
            0,
            ["fire", "normal"],
            [1, 0], // 1 fire energy required, 0 normal
            0,
            ""
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Ember");
            return false;
        }

        // Deal damage
        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        // Discard 1 fire energy from attacker
        attacker.discardEnergy("fire", 1);

        console.log(`Ember deals ${totalDamage} damage to ${defender.pokemonName} and discards 1 Fire energy from attacker`);
        return true;
    }
}

export class FireClaws extends Attack {
    constructor() {
        super(
            "Fire Claws",
            undefined,
            60,
            0,
            ["fire", "normal"],
            [1, 2],
            0,
            ""
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Fire Claws");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        console.log(`Fire Claws deals ${totalDamage} damage to ${defender.pokemonName}`);
        return true;
    }
}

export class FireSpin extends Attack {
    constructor() {
        super(
            "Fire Spin",
            "Discard 2 Fire energy from this Pokémon.",
            150,
            0,
            ["fire", "normal"],
            [2, 2],
            0,
            ""
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Fire Spin");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        // Discard 2 fire energy
        attacker.discardEnergy("fire", 2);

        console.log(`Fire Spin deals ${totalDamage} damage to ${defender.pokemonName} and discards 2 Fire energy from attacker`);
        return true;
    }
}

export class Slash extends Attack {
    constructor() {
        super(
            "Slash",
            undefined,
            60,
            0,
            ["fire", "normal"],
            [1, 2],
            0,
            ""
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Slash");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        console.log(`Slash deals ${totalDamage} damage to ${defender.pokemonName}`);
        return true;
    }
}

export class CrimsonStorm extends Attack {
    constructor() {
        super(
            "Crimson Storm",
            "Discard 2 Fire energy from this Pokémon.",
            200,
            0,
            ["fire", "normal"],
            [2, 2],
            0,
            ""
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (!attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)) {
            console.log("Not enough energy to perform Crimson Storm");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        // Discard 2 fire energy
        attacker.discardEnergy("fire", 2);

        console.log(`Crimson Storm deals ${totalDamage} damage to ${defender.pokemonName} and discards 2 Fire energy from attacker`);
        return true;
    }
}

export class VineWhip extends Attack {
    constructor() {
        super(
            "Vine Whip", // name
            undefined, // description
            40, // damage
            0, // damageAddOn
            ["grass", "normal"], // energyType: grass and normal
            [1, 1], // energyCost: 1 grass, 1 normal
            0, // coinflipCount
            "" // coinflipMulti
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        // check if has required energy
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Vine Whip");
            return false;
        }

        // bonus damage +20 if defender is Fire type
        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);

        // apply damage to defender
        defender.applyDamage(totalDamage);

        //  log success
        console.log(
            `Vine Whip deals ${totalDamage} damage to ${defender.pokemonName}`
        );

        return true;
    }
}

export class RazorLeaf extends Attack {
    constructor() {
        super(
            "Razor Leaf",
            undefined, // no description
            60, // damage
            0, // damageAddOn
            ["grass", "normal"], // energy types: grass and normal
            [1, 2], // energy cost: 1 grass, 2 normal
            0, // coinflipCount (none)
            "" // coinflipMulti (none)
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Razor Leaf");
            return false;
        }

        // base damage should be 60
        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);

        // apply damage to defender
        defender.applyDamage(totalDamage);

        //  log success
        console.log(
            `Razor Leaf deals ${totalDamage} damage to ${defender.pokemonName}`
        );

        return true;
    }
}

export class MegaDrain extends Attack {
    constructor() {
        super(
            "Mega Drain",
            undefined,
            80, // damage
            0, // damageAddOn
            ["grass", "normal"], // energy types: grass and normal
            [2, 2], // energy cost: 2 grass, 2 normal
            0, // coinflipCount (none)
            "" // coinflipMulti (none)
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        // Check energy requirements
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Mega Drain");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);

        // Apply damage to defender
        defender.applyDamage(totalDamage);

        // Heal attacker by 30 HP
        attacker.heal(30);

        // Log success
        console.log(
            `Mega Drain deals ${totalDamage} damage to ${defender.pokemonName} and heals attacker for 30 HP`
        );

        return true;
    }
}

export class GiantBloom extends Attack {
    constructor() {
        super(
            "Giant Bloom",
            undefined,
            60, // damage
            0, // damageAddOn
            ["grass", "normal"], // energy types
            [2, 2], // energy cost: 2 grass, 2 normal
            0, // coinflipCount
            "" // coinflipMulti
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        // Check energy requirements
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Giant Bloom");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);

        // Apply damage to defender
        defender.applyDamage(totalDamage);

        // Heal attacker by 40 HP
        attacker.heal(40);

        // Log success
        console.log(
            `Giant Bloom deals ${totalDamage} damage to ${defender.pokemonName} and heals attacker for 40 HP`
        );

        return true;
    }
}

export class WaterGun extends Attack {
    constructor() {
        super(
            "Water Gun",
            undefined,
            20,
            0,
            ["water", "normal"],
            [1, 0],
            0,
            ""
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Water Gun");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        console.log(
            `Water Gun deals ${totalDamage} damage to ${defender.pokemonName}`
        );
        return true;
    }
}

export class WaveSplash extends Attack {
    constructor() {
        super(
            "Wave Splash",
            undefined,
            40,
            0,
            ["water", "normal"],
            [1, 1],
            0,
            ""
        );
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Wave Splash");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        console.log(
            `Wave Splash deals ${totalDamage} damage to ${defender.pokemonName}`
        );
        return true;
    }
}

export class HydroPump extends Attack {
    constructor() {
        super(
            "Hydro Pump",
            undefined,
            80,
            0,
            ["water", "normal"],
            [2, 1],
            0,
            ""
        );
    }

    private extraDamage(attacker: PokemonCard): number {
        // Calculate extra water energies beyond 2 required
        const waterIndex = this.EnergyType.indexOf("water");
        if (waterIndex === -1) return 0;

        const attachedWater = attacker.getAttachedEnergyAmount("water");
        const requiredWater = this.EnergyCost[waterIndex];
        const extraWater = attachedWater - requiredWater;

        return extraWater >= 2 ? 60 : 0;
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Hydro Pump");
            return false;
        }

        let totalDamage = this.Damage + this.extraDamage(attacker);
        totalDamage = this.applyWeaknessBonus(defender, totalDamage);

        defender.applyDamage(totalDamage);

        console.log(
            `Hydro Pump deals ${totalDamage} damage to ${defender.pokemonName}`
        );
        return true;
    }
}

export class Surf extends Attack {
    constructor() {
        super("Surf", undefined, 40, 0, ["water", "normal"], [1, 1], 0, "");
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Surf");
            return false;
        }

        let totalDamage = this.applyWeaknessBonus(defender, this.Damage);
        defender.applyDamage(totalDamage);

        console.log(
            `Surf deals ${totalDamage} damage to ${defender.pokemonName}`
        );
        return true;
    }
}

export class HydroBazooka extends Attack {
    constructor() {
        super(
            "Hydro Bazooka",
            undefined,
            100,
            0,
            ["water", "normal"],
            [2, 1],
            0,
            ""
        );
    }

    private extraDamage(attacker: PokemonCard): number {
        // Same logic as Hydro Pump for extra water energy
        const waterIndex = this.EnergyType.indexOf("water");
        if (waterIndex === -1) return 0;

        const attachedWater = attacker.getAttachedEnergyAmount("water");
        const requiredWater = this.EnergyCost[waterIndex];
        const extraWater = attachedWater - requiredWater;

        return extraWater >= 2 ? 60 : 0;
    }

    public attackAction(defender: PokemonCard, attacker: PokemonCard): boolean {
        if (
            !attacker.checkEnergyRequirements(this.EnergyType, this.EnergyCost)
        ) {
            console.log("Not enough energy to perform Hydro Bazooka");
            return false;
        }

        let totalDamage = this.Damage + this.extraDamage(attacker);
        totalDamage = this.applyWeaknessBonus(defender, totalDamage);

        defender.applyDamage(totalDamage);

        console.log(
            `Hydro Bazooka deals ${totalDamage} damage to ${defender.pokemonName}`
        );
        return true;
    }
}