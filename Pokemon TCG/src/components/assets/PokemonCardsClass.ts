import { Ability } from "./AbilityClass.js";
import { Attack } from "./AttacksClass.js";
import { PokedexInfo } from "./PokedexInfo.js";

export class PokemonCard {
    private _evolutionStage: number;
    private _evolvesFrom: string;
    private _pokemonName: string;
    private _isEX: boolean;
    private _type: string;
    private _HP: number;
    private _pokemonPhoto: string;
    private _attacks: Attack[];
    private _abilities?: Ability;
    private _weakness: string;
    private _retreatCost: number;
    private _rarity: number;
    private _description: string;
    private _pokedexInfo: PokedexInfo;

    private _currentHP: number;
    private _boostedStats: { stat: string; amount: number };
    private _activeStatus: {
        statuses: Set<string>;
        poisonCount: number;
        burnCount: number;
    };
    private _attachedEnergyType: string[];
    private _attachedEnergyAmount: number[];
    private _isActive: boolean;
    private _isDiscarded: boolean;
    private _inBench: boolean;

    constructor(
        evolutionStage: number,
        evolvesFrom: string,
        pokemonName: string,
        isEX: boolean,
        type: string,
        HP: number,
        retreatCost: number,
        weakness: string,
        pokemonPhoto: string,
        description: string,
        rarity: number,
        pokedexInfo: PokedexInfo,
        attacks: Attack[],
        ability?: Ability,
        currentHP: number = HP,
        boostedStats: { stat: string; amount: number } = {
            stat: "",
            amount: 0,
        },
        activeStatus: {
            statuses?: Set<string>;
            poisonCount?: number;
            burnCount?: number;
        } = { statuses: new Set(), poisonCount: 0, burnCount: 0 },
        attachedEnergyType: string[] = [],
        attachedEnergyAmount: number[] = [],
        isActive: boolean = false,
        isDiscarded: boolean = false,
        inBench: boolean = true
    ) {
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

    public get evolutionStage(): number {
        return this._evolutionStage;
    }
    public get evolvesFrom(): string {
        return this._evolvesFrom;
    }
    public get pokemonName(): string {
        return this._pokemonName;
    }
    public get isEX(): boolean {
        return this._isEX;
    }
    public get type(): string {
        return this._type;
    }
    public get hp(): number {
        return this._HP;
    }
    public get pokemonPhoto(): string {
        return this._pokemonPhoto;
    }
    public get Attacks(): Attack[] {
        return this._attacks;
    }
    public get Abilities(): Ability | undefined {
        return this._abilities;
    }
    public get Weakness(): string {
        return this._weakness;
    }
    public get RetreatCost(): number {
        return this._retreatCost;
    }
    public get Rarity(): number {
        return this._rarity;
    }
    public get Description(): string {
        return this._description;
    }
    public get PokedexInfo(): PokedexInfo {
        return this._pokedexInfo;
    }

    public get CurrentHP(): number {
        return this._currentHP;
    }
    public get BoostedStats(): { stat: string; amount: number } {
        return this._boostedStats;
    }
    public get ActiveStatus(): {
        statuses: Set<string>;
        poisonCount: number;
        burnCount: number;
    } {
        return this._activeStatus;
    }
    public get AttachedEnergyType(): string[] {
        return this._attachedEnergyType;
    }
    public get AttachedEnergyAmount(): number[] {
        return this._attachedEnergyAmount;
    }
    public get IsActive(): boolean {
        return this._isActive;
    }
    public set IsActive(value: boolean) {
        this._isActive = value;
    }
    public get IsDiscarded(): boolean {
        return this._isDiscarded;
    }
    public get InBench(): boolean {
        return this._inBench;
    }

    public checkEnergyRequirements(
        requiredTypes: [string, string],
        requiredAmounts: [number, number]
    ): boolean {
        const [type1, type2] = requiredTypes;
        const [amt1, amt2] = requiredAmounts;

        const index1 = this._attachedEnergyType.indexOf(type1);
        const index2 = this._attachedEnergyType.indexOf(type2);

        const hasType1 =
            index1 !== -1 && this._attachedEnergyAmount[index1] >= amt1;
        const hasType2 =
            index2 !== -1 && this._attachedEnergyAmount[index2] >= amt2;

        return hasType1 && hasType2;
    }

    public getAttachedEnergyAmount(type: string): number {
        const index = this._attachedEnergyType.indexOf(type);
        if (index === -1) return 0;
        return this._attachedEnergyAmount[index];
    }
    public applyDamage(amount: number): void {
        this._currentHP = Math.max(0, this._currentHP - amount);
    }

    public heal(amount: number): void {
        this._currentHP = Math.min(this._HP, this._currentHP + amount);
    }

    public attachEnergy(energyType: string, amount: number): void {
        const index = this._attachedEnergyType.indexOf(energyType);
        if (index !== -1) {
            this._attachedEnergyAmount[index] += amount;
        } else {
            this._attachedEnergyType.push(energyType);
            this._attachedEnergyAmount.push(amount);
        }
    }

    public discardEnergy(energyType: string, amount: number): void {
        const index = this._attachedEnergyType.indexOf(energyType);
        if (index !== -1) {
            this._attachedEnergyAmount[index] = Math.max(
                0,
                this._attachedEnergyAmount[index] - amount
            );
        }
    }

    public retreat(): boolean {
        const retreatCost = this._retreatCost;
        if (retreatCost === 0) {
            this._isActive = false;
            this._inBench = true;
            return true;
        }

        const totalEnergy = this._attachedEnergyAmount.reduce(
            (sum, amt) => sum + amt,
            0
        );
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
            } else {
                // Remove only needed amount
                this._attachedEnergyAmount[maxIndex] -= energyToRemove;
                energyToRemove = 0;
            }
        }

        this._isActive = false;
        this._inBench = true;

        return true;
    }

    // set over array as sets cannot have duplicates, and has more straightforward functions .add, .deleat etc
    private static nonStackableStatuses = new Set([
        "ASLEEP",
        "PARALYZED",
        "CONFUSED",
    ]);

    public applyStatusCondition(condition: string): void {
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

    public clearStatusCondition(condition?: string): boolean {
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

    public getActiveStatuses(): string[] {
        return Array.from(this._activeStatus.statuses);
    }

    public getPoisonCount(): number {
        return this._activeStatus.poisonCount;
    }

    public getBurnCount(): number {
        return this._activeStatus.burnCount;
    }
}
