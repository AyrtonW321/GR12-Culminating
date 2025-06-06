import { Attack } from "./AttacksClass.js";
import { PokemonCard } from "./PokemonCardsClass.js";

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
