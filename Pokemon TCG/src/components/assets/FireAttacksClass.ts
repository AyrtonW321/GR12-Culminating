import { Attack } from "./AttacksClass.js";
import { PokemonCard } from "./PokemonCardsClass.js";

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
