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
}
