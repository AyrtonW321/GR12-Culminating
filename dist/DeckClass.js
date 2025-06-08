export class Deck {
    constructor(name) {
        this._name = name;
        this._pokemonCards = new Map();
        this._selectedEnergyTypes = new Set();
    }
    get name() {
        return this._name;
    }
    get cardCount() {
        return Array.from(this._pokemonCards.values()).reduce((sum, count) => sum + count, 0);
    }
    get energyTypes() {
        return Array.from(this._selectedEnergyTypes);
    }
    addPokemonCard(card, quantity = 1) {
        if (this.cardCount + quantity > 20) {
            console.log("TCGP decks cannot exceed 20 cards");
            return false;
        }
        const currentCount = this._pokemonCards.get(card) || 0;
        if (currentCount + quantity > 4) {
            console.log(`Cannot have more than 4 copies of ${card.pokemonName}`);
            return false;
        }
        this._pokemonCards.set(card, currentCount + quantity);
        return true;
    }
    // Remove Pokémon card
    removePokemonCard(card, quantity = 1) {
        const currentCount = this._pokemonCards.get(card) || 0;
        if (currentCount < quantity) {
            console.error(`Not enough copies of ${card.pokemonName} to remove`);
            return false;
        }
        if (currentCount === quantity) {
            this._pokemonCards.delete(card);
        }
        else {
            this._pokemonCards.set(card, currentCount - quantity);
        }
        return true;
    }
    addEnergyType(type) {
        const energy = type.toLowerCase();
        if (this._selectedEnergyTypes.has(energy)) {
            return false;
        }
        this._selectedEnergyTypes.add(energy);
        return true;
    }
    removeEnergyType(type) {
        return this._selectedEnergyTypes.delete(type.toLowerCase());
    }
    validate() {
        if (this.cardCount !== 20) {
            console.log(`TCGP decks must have exactly 20 cards (currently ${this.cardCount})`);
            return false;
        }
        const hasBasicPokemon = Array.from(this._pokemonCards.keys()).some((card) => card.evolutionStage === 1);
        if (!hasBasicPokemon) {
            console.error("Deck must contain at least 1 Basic Pokémon");
            return false;
        }
        return true;
    }
    getDeckList() {
        return Array.from(this._pokemonCards.entries()).map(([card, count]) => ({
            card,
            count,
        }));
    }
}
//# sourceMappingURL=DeckClass.js.map