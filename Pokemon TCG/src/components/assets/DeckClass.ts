import { PokemonCard } from "./PokemonCardsClass.js";

export class Deck {
    private _name: string;
    private _pokemonCards: Map<PokemonCard, number>;
    private _selectedEnergyTypes: Set<string>;

    constructor(name: string) {
        this._name = name;
        this._pokemonCards = new Map();
        this._selectedEnergyTypes = new Set();
    }

    public get name(): string {
        return this._name;
    }
    public get cardCount(): number {
        return Array.from(this._pokemonCards.values()).reduce(
            (sum, count) => sum + count,
            0
        );
    }
    public get energyTypes(): string[] {
        return Array.from(this._selectedEnergyTypes);
    }

    public addPokemonCard(card: PokemonCard, quantity: number = 1): boolean {
        if (this.cardCount + quantity > 20) {
            console.log("TCGP decks cannot exceed 20 cards");
            return false;
        }

        const currentCount = this._pokemonCards.get(card) || 0;
        if (currentCount + quantity > 4) {
            console.log(
                `Cannot have more than 4 copies of ${card.pokemonName}`
            );
            return false;
        }

        this._pokemonCards.set(card, currentCount + quantity);
        return true;
    }

    // Remove Pokémon card
    public removePokemonCard(card: PokemonCard, quantity: number = 1): boolean {
        const currentCount = this._pokemonCards.get(card) || 0;
        if (currentCount < quantity) {
            console.error(`Not enough copies of ${card.pokemonName} to remove`);
            return false;
        }

        if (currentCount === quantity) {
            this._pokemonCards.delete(card);
        } else {
            this._pokemonCards.set(card, currentCount - quantity);
        }
        return true;
    }

    public addEnergyType(type: string): boolean {
        const energy = type.toLowerCase();
        if (this._selectedEnergyTypes.has(energy)) {
            return false;
        }
        this._selectedEnergyTypes.add(energy);
        return true;
    }

    public removeEnergyType(type: string): boolean {
        return this._selectedEnergyTypes.delete(type.toLowerCase());
    }

    public validate(): boolean {
        if (this.cardCount !== 20) {
            console.log(
                `TCGP decks must have exactly 20 cards (currently ${this.cardCount})`
            );
            return false;
        }

        const hasBasicPokemon = Array.from(this._pokemonCards.keys()).some(
            (card) => card.evolutionStage === 1
        );
        if (!hasBasicPokemon) {
            console.error("Deck must contain at least 1 Basic Pokémon");
            return false;
        }

        return true;
    }

    public getDeckList(): { card: PokemonCard; count: number }[] {
        return Array.from(this._pokemonCards.entries()).map(
            ([card, count]) => ({
                card,
                count,
            })
        );
    }

    // the deck you play with is a copy of the deck you created, so it dosent influence the original deck
    public clone(): Deck {
        const newDeck = new Deck(this.name);

        const cardsArray = Array.from(this._pokemonCards.entries());
        for (let i = 0; i < cardsArray.length; i++) {
            const [card, count] = cardsArray[i];
            newDeck._pokemonCards.set(card, count);
        }

        const energyTypesArray = Array.from(this._selectedEnergyTypes);
        for (let i = 0; i < energyTypesArray.length; i++) {
            newDeck._selectedEnergyTypes.add(energyTypesArray[i]);
        }

        return newDeck;
    }

    // function to deleat the deck after the battle is over
    public discard(): void {
        this._pokemonCards.clear();
        this._selectedEnergyTypes.clear();
    }
}
