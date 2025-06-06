import { Attack } from "./AttacksClass.js";
import { PokemonCard } from "./PokemonCardsClass.js";

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
