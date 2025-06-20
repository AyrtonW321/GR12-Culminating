import { PokemonCard } from "./PokemonCardsClass.js";

// class that handles the deck creation & storage of battle decks
export class Deck {
    // deck properties
    private _name: string;
    // stored in the map to pervent duplicate cards in an array, easier to count the cards in a deck
    private _pokemonCards: Map<PokemonCard, number>;
    // energy type of the deck, sets so no duplication of energies
    private _selectedEnergyTypes: Set<string>;

    // constructor
    constructor(name: string) {
        this._name = name;
        this._pokemonCards = new Map();
        this._selectedEnergyTypes = new Set();
    }

    // getters
    public get name(): string {
        return this._name;
    }
    public get cardCount(): number {
        // counts the amount of cards in the map
        return Array.from(this._pokemonCards.values()).reduce(
            (sum, count) => sum + count,
            0
        );
    }

    public get energyTypes(): string[] {
        return Array.from(this._selectedEnergyTypes);
    }

    /**
     * adds a specific pokemon card to the deck
     * 
     * @param card the pokemon card being added
     * @param quantity the amount of cards being added, defualts to 1
     * @returns returns true of the card is added, else returns false
     */
    public addPokemonCard(card: PokemonCard, quantity: number = 1): boolean {
        // deck cannot exceed 20 cards, returns false if exceeded
        if (this.cardCount + quantity > 20) {
            console.log("TCGP decks cannot exceed 20 cards");
            return false;
        }

        // cannot have more than 4 copies of a unique card in the deck
        const currentCount = this._pokemonCards.get(card) || 0;
        if (currentCount + quantity > 4) {
            console.log(
                `Cannot have more than 4 copies of ${card.pokemonName}`
            );
            return false;
        }

        // if card is added, adds 1 to the count OR add the card 
        this._pokemonCards.set(card, currentCount + quantity);
        return true;
    }

    /**
     * removes a select pokemon card in the deck
     * 
     * @param card the pokemon card being removed
     * @param quantity the amount of the card being removed
     * @returns returns true of the card is removed, else returns false
     */
    public removePokemonCard(card: PokemonCard, quantity: number = 1): boolean {
        // if there isnt enough cards to remove, returns false
        const currentCount = this._pokemonCards.get(card) || 0;
        if (currentCount < quantity) {
            console.error(`Not enough copies of ${card.pokemonName} to remove`);
            return false;
        }

        // deleats the card from the map if user removes the last one, else, just remove a count from it
        if (currentCount === quantity) {
            this._pokemonCards.delete(card);
        } else {
            this._pokemonCards.set(card, currentCount - quantity);
        }
        return true;
    }

    /**
     * adds a energy type to the deck, during battle, the energy type will randomly show up in the deck
     * 
     * @param type type of energy
     * @returns returns true if successfully added, false otherwise
     */
    public addEnergyType(type: string): boolean {
        const energy = type.toLowerCase();
        // if already has the energy type, returns false, else adds it and returns true
        if (this._selectedEnergyTypes.has(energy)) {
            return false;
        }
        this._selectedEnergyTypes.add(energy);
        return true;
    }

    /**
     * removes the specific energy type from the deck
     * 
     * @param type type of energy to remove
     * @returns if successfully removed, returns true, else, return false
     */
    public removeEnergyType(type: string): boolean {
        return this._selectedEnergyTypes.delete(type.toLowerCase());
    }

    /**
     * validates the deck
     * 
     * @returns returns true if successfully validates, false otherwise
     */
    public validate(): boolean {
        // ensure deck has 20 card
        if (this.cardCount !== 20) {
            console.log(
                `TCGP decks must have exactly 20 cards (currently ${this.cardCount})`
            );
            return false;
        }

        // ensre deck has at least 1 basic pokemon
        const hasBasicPokemon = Array.from(this._pokemonCards.keys()).some(
            (card) => card.evolutionStage === 1
        );
        if (!hasBasicPokemon) {
            console.error("Deck must contain at least 1 Basic Pokémon");
            return false;
        }

        return true;
    }

    /**
     * get the entire list of cards in the deck as an array
     * @returns returns the array of objects with the pokemon card and the count
     */
    public getDeckList(): { card: PokemonCard; count: number }[] {
        return Array.from(this._pokemonCards.entries()).map(
            ([card, count]) => ({
                card,
                count,
            })
        );
    }

    /**
     * clones the current deck, only stored in the "_currentDeck" of the user, this is done so any modifications done to the cards inside eg. change hp, does not affect the next use of this deck
     * @returns 
     */
    public clone(): Deck {
        // creates a new deck of the same name as the old one
        const newDeck = new Deck(this.name);

        // duplicates the cards
        const cardsArray = Array.from(this._pokemonCards.entries());
        for (let i = 0; i < cardsArray.length; i++) {
            const [card, count] = cardsArray[i];
            newDeck._pokemonCards.set(card, count);
        }

        // duplicates the energy types
        const energyTypesArray = Array.from(this._selectedEnergyTypes);
        for (let i = 0; i < energyTypesArray.length; i++) {
            newDeck._selectedEnergyTypes.add(energyTypesArray[i]);
        }

        // returns the new deck
        return newDeck;
    }

    /**
     * discards the cloned deck after battle
     */
    public discard(): void {
        this._pokemonCards.clear();
        this._selectedEnergyTypes.clear();
    }

    /**
     * serializes a array class into json string format
     * used to store or transfer the data
     * 
     * @returns returns a plain JS object representing the current state of the class with its properties
     */
    public toJSON() {
        return {
            name: this._name,
            pokemonCards: Array.from(this._pokemonCards.entries()).map(
                ([card, count]) => ({
                    cardData: card.toJSON(),
                    count,
                })
            ),
            selectedEnergyTypes: Array.from(this._selectedEnergyTypes),
        };
    }

    /**
     * Recreates an instance from a json object
     *
     * deserializes a plain object, parsed from json
     * into an instance by extracting its properties.
     *
     * @param {any} json - the json object containing all the properties of the ability class
     */
    static fromJSON(json: any): Deck {
        const deck = new Deck(json.name);

        json.pokemonCards.forEach((entry: { cardData: any; count: number }) => {
            const card = PokemonCard.fromJSON(entry.cardData);
            if (card) {
                deck._pokemonCards.set(card, entry.count);
            } else {
                // warns in the console if the pokemon cannot be deserialized, debugging code
                console.warn(
                    `Failed to deserialize card in deck: ${
                        entry.cardData._pokemonName || "unknown"
                    }`
                );
            }
        });

        json.selectedEnergyTypes.forEach((type: string) => {
            deck._selectedEnergyTypes.add(type);
        });

        return deck;
    }
}
