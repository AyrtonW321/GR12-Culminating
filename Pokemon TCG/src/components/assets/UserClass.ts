import { PokemonCard } from "./PokemonCardsClass.js";
import {
    CharmanderCard,
    CharmeleonCard,
    CharizardCard,
    CharizardEXCard,
} from "./CharmanderEvoClass.js";
import {
    BulbasaurCard,
    IvysaurCard,
    VenusaurCard,
    VenusaurEXCard,
} from "./BulbasaurEvoClass.js";
import {
    SquirtleCard,
    WartortleCard,
    BlastoiseCard,
    BlastoiseEXCard,
} from "./SquirtleEvoClass.js";
import { Deck } from "./DeckClass.js";
import { UserStats } from "./UserStatsClass.js";
import { GameRecord } from "./GameRecordClass.js";
import { Attack } from "./AttacksClass.js";

// all the cards currently in the game
const ALL_CARDS: PokemonCard[] = [
    new CharmanderCard(),
    new CharmeleonCard(),
    new CharizardCard(),
    new CharizardEXCard(),
    new BulbasaurCard(),
    new IvysaurCard(),
    new VenusaurCard(),
    new VenusaurEXCard(),
    new SquirtleCard(),
    new WartortleCard(),
    new BlastoiseCard(),
    new BlastoiseEXCard(),
];

// defualt hourglass cost
const HOURGLASS_COST = 12;

// class for the user
export class User {
    // properties that are user specific, non battle specific properties
    private _username: string;
    private _email: string;
    private _password: string;
    private _collection: Map<PokemonCard, number>;
    private _decks: Deck[];
    private _victories: number;
    private _gameStats: UserStats;
    private _winRate: number;
    private _gameHistory: GameRecord[];

    // battle specific properties
    private _activeDeckName: string | null = null;
    private _activeDeck: Deck | null = null;
    private _activeCard: PokemonCard;
    private _bench: PokemonCard[];
    private _hand: PokemonCard[];
    private _discardPile: PokemonCard[];
    private _currentPoints: number;

    // num of hourglasses the user has
    private _hourglasses: number;

    // constructor
    constructor(username: string, email: string, password: string) {
        this._password = password;
        this._email = email;
        this._username = username;
        this._collection = new Map();
        this._gameStats = new UserStats(0, 0, 0);
        this._hourglasses = 0;
    }

    // getters & setters
    get username(): string {
        return this._username;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get collection(): Map<PokemonCard, number> {
        return this._collection;
    }

    get decks(): Deck[] {
        return this._decks;
    }

    get activeDeckName(): string | null {
        return this._activeDeckName;
    }

    set activeDeckName(name: string | null) {
        this._activeDeckName = name;

        if (name === null) {
            this._activeDeck = null;
            return;
        }

        const foundDeck = this._decks.find((deck) => deck.name === name);
        if (foundDeck) {
            this._activeDeck = foundDeck.clone();
        } else {
            console.log(`Deck named "${name}" not found.`);
            this._activeDeck = null;
        }
    }

    get activeDeck(): Deck | null {
        return this._activeDeck;
    }

    set activeDeck(deck: Deck | null) {
        if (deck === null) {
            this._activeDeck = null;
            this._activeDeckName = null;
        } else {
            this._activeDeck = deck;
            this._activeDeckName = deck.name;
        }
    }

    get activeCard(): PokemonCard {
        return this._activeCard;
    }

    set activeCard(card: PokemonCard) {
        this._activeCard = card;
    }

    get victories(): number {
        return this._victories;
    }

    get bench(): PokemonCard[] {
        return this._bench;
    }

    set bench(newBench: PokemonCard[]) {
        this._bench = newBench;
    }

    get hand(): PokemonCard[] {
        return this._hand;
    }

    set hand(newHand: PokemonCard[]) {
        this._hand = newHand;
    }

    get discardPile(): PokemonCard[] {
        return this._discardPile;
    }

    set discardPile(newDiscardPile: PokemonCard[]) {
        this._discardPile = newDiscardPile;
    }

    get gameStats(): UserStats {
        return this._gameStats;
    }

    get gameHistory(): GameRecord[] {
        return this._gameHistory;
    }

    get winRate(): number {
        return this._winRate;
    }

    get hourglass(): number {
        return this._hourglasses;
    }

    // opens a boosterpack, defaults to 5 cards
    public openBoosterPack(cardsToOpen: number = 5): PokemonCard[] {
        const cardsByRarity: Record<number, PokemonCard[]> = {};
        // sorts all the cards by rarity
        for (let rarity = 1; rarity <= 8; rarity++) {
            cardsByRarity[rarity] = ALL_CARDS.filter(
                (card) => card.Rarity === rarity
            );
        }

        // <order of card in pack, <rarity, drop rate in %>>
        const dropRates: Record<number, Record<number, number>> = {
            1: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
            2: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
            3: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
            4: {
                1: 0,
                2: 90,
                3: 5,
                4: 1.6,
                5: 2.572,
                6: 0.5,
                7: 0.222,
                8: 0.04,
            },
            5: {
                1: 0,
                2: 60,
                3: 20,
                4: 6.66,
                5: 10.288,
                6: 2,
                7: 0.888,
                8: 0.16,
            },
        };

        /**
         * adjusts the droprate of the slot, done as some rarities are not implemented, eg crown rare, so rates are adjusted to fill in the gaps
         * @param slot slot of droprate adjust
         * @returns returns the droprates for that rarity
         */
        function adjustDropRates(slot: number): Record<number, number> {
            // constants for the droprates
            const rates = dropRates[slot];
            const filteredRates: Record<number, number> = {};
            // should add up to 100
            let totalRate = 0;

            // rarity tiers
            const rarityTiers = Object.keys(rates);

            // goes through the rarity tiers and finds available tiers
            // ifrate is greater than 0, add its rate to filteredRates and increases totalRate
            for (let i = 0; i < rarityTiers.length; i++) {
                const rarity = parseInt(rarityTiers[i]);
                if (
                    cardsByRarity[rarity] &&
                    cardsByRarity[rarity].length > 0 &&
                    rates[rarity] > 0
                ) {
                    filteredRates[rarity] = rates[rarity];
                    totalRate += rates[rarity];
                }
            }
            
            // normalizes the drop rates, first divides the drop rate by total rate, and times it by 100, this way
            // the card will always have its drop rates total to 100
            const filteredKeys = Object.keys(filteredRates);
            for (let i = 0; i < filteredKeys.length; i++) {
                const dropRate = parseInt(filteredKeys[i]);
                filteredRates[dropRate] =
                    (filteredRates[dropRate] / totalRate) * 100;
            }
            return filteredRates;
        }

        
        /**
         * Selects a rarity tier based on adjusted drop rates for a given slot
         * then generates a random number to determine which rarity is selected
         *
         * @param slot the slot the drop is being chosen from
         * @returns the selected rarity as a number
         */
        function pickRarity(slot: number): number {
            const rates = adjustDropRates(slot);
            // randomly generates a number
            const randomNum = Math.random() * 100;
            let totalDropRate = 0;
            const rarityTiers = Object.keys(rates);
            for (let i = 0; i < rarityTiers.length; i++) {
                const rarity = parseInt(rarityTiers[i]);
                totalDropRate += rates[rarity];
                if (randomNum <= totalDropRate) {
                    // returns the rarity chosen
                    return rarity;
                }
            }
            return 1;
        }

        /**
         * Returns the highest available rarity less than or equal to the specified rarity.
         *
         * @param rarity the starting rarity level to check from
         * @returns highest rarity level available, defualts to 1 if none are found
         */
        function getAvailableRarity(rarity: number): number {
            for (let r = rarity; r >= 1; r--) {
                if (cardsByRarity[r] && cardsByRarity[r].length > 0) {
                    return r;
                }
            }
            return 1;
        }

        /**
         * picks a card randomly from the rarity
         * @param rarity the rarity given
         * @returns returns a random pokemon card in that section
         */
        function pickCardFromRarity(rarity: number): PokemonCard {
            const list = cardsByRarity[rarity];
            if (!list || list.length === 0) {
                console.log("No cards available of rarity " + rarity);
            }
            const randomCardLocation = Math.floor(Math.random() * list.length);
            return list[randomCardLocation];
        }

        // chance to roll a god pack is 0.05% or 1/2000
        const godPackRoll = Math.random();
        if (godPackRoll <= 0.0005) {
            for (let rarity = 8; rarity >= 1; rarity--) {
                if (cardsByRarity[rarity] && cardsByRarity[rarity].length > 0) {
                    const godPackCards: PokemonCard[] = [];
                    for (let i = 0; i < 5; i++) {
                        // only get the highest rarity of cards available
                        godPackCards.push(pickCardFromRarity(rarity));
                    }
                    return godPackCards;
                }
            }
        }

        const packCards: PokemonCard[] = [];

        // push cards into the pack, using all the algorithems above
        for (let slot = 1; slot <= cardsToOpen; slot++) {
            const slotRatesKey = slot <= 3 ? 1 : slot;
            let rarity = pickRarity(slotRatesKey);
            rarity = getAvailableRarity(rarity);
            const card = pickCardFromRarity(rarity);
            packCards.push(card);
        }

        // adds the pack cards to the users collectiob
        this.addToCollection(packCards);

        // returns the pack
        return packCards;
    }

    /**
     * adds the cards from the pack to the users collection
     * @param cards cards to add as a pokemon card array
     * @returns true if successfully added, false otherwise
     */
    public addToCollection(cards: PokemonCard[]): boolean {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            let existingCard: PokemonCard | undefined;
            const collectionKeys = Array.from(this._collection.keys());
            // adds 1 to the card count if the cards are the same
            for (let i = 0; i < collectionKeys.length; i++) {
                if (this.areCardsEqual(collectionKeys[i], card)) {
                    existingCard = collectionKeys[i];
                    break;
                }
            }

            if (existingCard) {
                const currentCount = this._collection.get(existingCard) || 0;
                this._collection.set(existingCard, currentCount + 1);
            } else {
                this._collection.set(card, 1);
            }
        }
        return true;
    }

    /**
     * checks if 2 cards are the same card
     * @param card1 card 1 to check
     * @param card2 card 2 to check
     * @returns returns true if same, false else
     */
    private areCardsEqual(card1: PokemonCard, card2: PokemonCard): boolean {
        return (
            card1.pokemonPhoto === card2.pokemonPhoto &&
            card1.isEX === card2.isEX &&
            card1.Rarity === card2.Rarity &&
            card1.type === card2.type &&
            card1.evolvesFrom === card2.evolvesFrom &&
            card1.hp === card2.hp &&
            card1.CurrentHP === card2.CurrentHP &&
            card1.Attacks?.length === card2.Attacks?.length &&
            card1.evolutionStage === card2.evolutionStage &&
            card1.Weakness === card2.Weakness &&
            card1.RetreatCost === card2.RetreatCost
        );
    }

    /**
     * filters the users collection
     * @param filters filters to apply
     * @returns returns a filteres selection of the users cards
     */
    public searchCollection(filters?: {
        name?: string;
        type?: string;
        minRarity?: number;
        maxRarity?: number;
        minHP?: number;
        maxHP?: number;
        minCount?: number;
        sortBy?: "name" | "rarity" | "hp" | "count";
        sortOrder?: "asc" | "desc";
    }): { card: PokemonCard; count: number }[] {
        // pokemon cards
        const keys: PokemonCard[] = [];
        // num of a certain card
        const values: number[] = [];

        // iterates thru the current collection and pushes cards count and type into a object
        const currentIteration = this._collection.entries();
        let nextIteration = currentIteration.next();
        while (!nextIteration.done) {
            const [card, count] = nextIteration.value;
            keys.push(card);
            values.push(count);
            nextIteration = currentIteration.next();
        }

        // results of the push
        const results: { card: PokemonCard; count: number }[] = [];

        // filtering the cards by types that is inputted by the user
        for (let i = 0; i < keys.length; i++) {
            const card = keys[i];
            const count = values[i];

            if (
                filters?.name &&
                !card.pokemonName
                    .toLowerCase()
                    .includes(filters.name.toLowerCase())
            ) {
                continue;
            }
            
            if (filters?.type && card.type !== filters.type) {
                continue;
            }

            if (filters?.minRarity && card.Rarity < filters.minRarity) {
                continue;
            }
            if (filters?.maxRarity && card.Rarity > filters.maxRarity) {
                continue;
            }

            if (filters?.minHP && card.hp < filters.minHP) {
                continue;
            }
            if (filters?.maxHP && card.hp > filters.maxHP) {
                continue;
            }

            if (filters?.minCount && count < filters.minCount) {
                continue;
            }

            results.push({ card, count });
        }

        // sort filters to apply and sort the results of the initial filter
        if (filters?.sortBy) {
            const descending = filters.sortOrder === "desc";

            // bubble sort the pokemon cards, the user dosen't have many unique types of pokemon cards, so bubble sort is effective and quick
            for (let j = 0; j < results.length - 1; j++) {
                for (let k = 0; k < results.length - 1 - j; k++) {
                    const a = results[k];
                    const b = results[k + 1];
                    let shouldSwap = false;

                    switch (filters.sortBy) {
                        case "name":
                            // from z->a
                            if (descending) {
                                if (
                                    a.card.pokemonName.localeCompare(
                                        b.card.pokemonName
                                    ) < 0
                                ) {
                                    shouldSwap = true;
                                }
                            } else {
                                // from a->z
                                if (
                                    a.card.pokemonName.localeCompare(
                                        b.card.pokemonName
                                    ) > 0
                                ) {
                                    shouldSwap = true;
                                }
                            }
                            break;

                        case "rarity":
                            if (descending) {
                                if (a.card.Rarity < b.card.Rarity) {
                                    shouldSwap = true;
                                }
                            } else {
                                if (a.card.Rarity > b.card.Rarity) {
                                    shouldSwap = true;
                                }
                            }
                            break;

                        case "hp":
                            if (descending) {
                                if (a.card.hp < b.card.hp) {
                                    shouldSwap = true;
                                }
                            } else {
                                if (a.card.hp > b.card.hp) {
                                    shouldSwap = true;
                                }
                            }
                            break;

                        case "count":
                            if (descending) {
                                if (a.count < b.count) {
                                    shouldSwap = true;
                                }
                            } else {
                                if (a.count > b.count) {
                                    shouldSwap = true;
                                }
                            }
                            break;
                    }

                    if (shouldSwap) {
                        const temp = results[k];
                        results[k] = results[k + 1];
                        results[k + 1] = temp;
                    }
                }
            }
        }

        return results;
    }

    /**
     * creates a deck
     * @param name name of deck
     * @param cards cards in the deck
     * @param energyTypes energy type in the deck
     * @returns returns the deck, or null if creation fails
     */
    public createDeck(
        name: string,
        cards: { card: PokemonCard; count: number }[],
        energyTypes: string[] = []
    ): Deck | null {
        // deck needs a name
        if (!name.trim()) {
            console.log("Deck name cannot be empty");
            return null;
        }

        // deck cannot have 0 cards
        if (cards.length === 0) {
            console.log("Deck must contain at least 1 card");
            return null;
        }

        const newDeck = new Deck(name);

        // adds cards to the deck
        for (let i = 0; i < cards.length; i++) {
            const { card, count } = cards[i];

            const available = this._collection.get(card) ?? 0;
            if (available < count) {
                // console logs an error if the user does not have the amount of cards required to be added
                console.log(
                    `Not enough ${card.pokemonName} (Need ${count}, have ${available})`
                );
                return null;
            }

            // error if the card addition failed, debugging line
            if (!newDeck.addPokemonCard(card, count)) {
                console.log(`Failed to add ${count}x ${card.pokemonName}`);
                return null;
            }
        }

        // adds energy type, error if invalid energy type
        for (let i = 0; i < energyTypes.length; i++) {
            if (!newDeck.addEnergyType(energyTypes[i])) {
                console.log(`Invalid energy type: ${energyTypes[i]}`);
                return null;
            }
        }

        // validates deck
        if (!newDeck.validate()) {
            console.log(
                "Deck failed validation - check card counts/energy requirements"
            );
            return null;
        }

        // pushes deck, console logs for debug
        this._decks.push(newDeck);
        console.log(`Created deck "${name}" with:
        - ${cards.reduce((sum, c) => sum + c.count, 0)} Pokemon cards
        - ${energyTypes.length} energy types`);
        // returns the new deck
        return newDeck;
    }

    /**
     * deleats a deck
     * @param deckName deck to deleat
     * @returns true if deleated, false otherwise
     */
    public deleteDeck(deckName: string): boolean {
        const index = this._decks.findIndex((deck) => deck.name === deckName);
        if (index === -1) {
            return false;
        }
        this._decks.splice(index, 1);
        return true;
    }

    /**
     * checks the player's active pokemon and bench for any pokemon cards with 0 HP
     *
     * @returns An array of pokemon cards that were discarded during this check
     */
    public checkForDiscard(): PokemonCard[] {
        const discardedCards: PokemonCard[] = [];

        if (this._activeCard && this._activeCard.CurrentHP === 0) {
            discardedCards.push(this._activeCard);
            this._discardPile.push(this._activeCard);
            this._activeCard = undefined as unknown as PokemonCard;
        }

        const survivingBench: PokemonCard[] = [];
        for (let i = 0; i < this._bench.length; i++) {
            const card = this._bench[i];
            if (card.CurrentHP === 0) {
                discardedCards.push(card);
                this._discardPile.push(card);
            } else {
                survivingBench.push(card);
            }
        }

        this._bench = survivingBench;

        return discardedCards;
    }

    /**
     * attach energy to pokemon
     * @param pokemon pokemon to attach to
     * @param energy type of energy
     * @param amount amt of energy
     * @returns 
     */
    public attachEnergy(
        pokemon: PokemonCard,
        energy: string,
        amount: number = 1
    ): boolean {
        const inPlay =
            this._activeCard === pokemon || this._bench.includes(pokemon);
        if (!inPlay) return false;

        pokemon.attachEnergy(energy, amount);
        return true;
    }

    /**
     * ends the game between 2 players
     * @param player1 player 1
     * @param player2 player 2
     * @returns returns the winner if game does not draw, and sets endgame to true
     */
    public endGame(
        player1: User,
        player2: User
    ): { winner?: string; endGame: boolean } {
        if (player1._currentPoints === 3) {
            player1.gameStats.addWin();
            player2.gameStats.addLoss();
            player1.discardActiveDeck();
            player2.discardActiveDeck();

            return { winner: player1._username, endGame: true };
        }
        if (player2._currentPoints === 3) {
            player1.gameStats.addWin();
            player2.gameStats.addLoss();
            player1.discardActiveDeck();
            player2.discardActiveDeck();

            return { winner: player2._username, endGame: true };
        }
        return { endGame: false };
    }

    /**
     * discards the active deck, clears it from the users acitve deck slot
     */
    public discardActiveDeck() {
        this._activeDeck = null;
        this._activeDeckName = null;
    }

    /**
     * updates the users profile
     * @param newUsername 
     * @param newPassword 
     * @param newEmail 
     * @returns returns true if updates, false otherwise
     */
    public updateProfile(
        newUsername?: string,
        newPassword?: string,
        newEmail?: string
    ): boolean {
        let updated = false;

        if (newUsername !== undefined) {
            if (!newUsername || newUsername.trim().length === 0) {
                console.log("Username cannot be empty");
                return false;
            }
            this._username = newUsername;
            console.log(`Username changed to ${newUsername}`);
            updated = true;
        }

        if (newPassword !== undefined) {
            if (!newPassword || newPassword.trim().length === 0) {
                console.log("Password cannot be empty");
                return false;
            }
            this._password = newPassword;
            console.log("Password updated.");
            updated = true;
        }

        if (newEmail !== undefined) {
            if (!newEmail || newEmail.trim().length === 0) {
                console.log("Email cannot be empty");
                return false;
            }
            this._email = newEmail;
            console.log(`Email changed to ${newEmail}`);
            updated = true;
        }

        if (!updated) {
            console.log("No profile fields provided to update profile");
            return false;
        }

        return true;
    }

    /**
     * opens pack using hourglasses
     * @returns returns array of pokemon cards opened
     */
    public openPackUsingHourglass(): PokemonCard[] | null {
        if (this._hourglasses < HOURGLASS_COST) {
            return null;
        }
        this._hourglasses -= HOURGLASS_COST;
        return this.openBoosterPack();
    }

    /**
     * adds hourglass to the users account
     * @param amt amt to add
     * @returns number of the users hourglass
     */
    public addHourglass(amt: number): number {
        this._hourglasses += amt;
        return this._hourglasses;
    }
    
    /**
     * serializes a array class into json string format
     * used to store or transfer the data
     * 
     * @returns returns a plain JS object representing the current state of the class with its properties
     */
    public toJSON() {
        return {
            _username: this._username ?? null,
            _email: this._email ?? null,
            _password: this._password ?? null,

            _collection: this._collection
                ? Array.from(this._collection.entries()).map(
                      ([card, count]) => [card?.toJSON?.() ?? null, count]
                  )
                : [],

            _decks: this._decks?.map((deck) => deck?.toJSON?.() ?? null) ?? [],

            _victories: this._victories ?? 0,
            _gameStats: this._gameStats?.toJSON?.() ?? null,
            _winRate: this._winRate ?? 0,

            _gameHistory:
                this._gameHistory?.map(
                    (record: GameRecord): any => record?.toJSON?.() ?? null
                ) ?? [],

            _activeDeckName: this._activeDeckName ?? null,
            _activeDeck: this._activeDeck?.toJSON?.() ?? null,
            _activeCard: this._activeCard?.toJSON?.() ?? null,
            _bench: this._bench?.map((card) => card?.toJSON?.() ?? null) ?? [],
            _hand: this._hand?.map((card) => card?.toJSON?.() ?? null) ?? [],
            _discardPile:
                this._discardPile?.map((card) => card?.toJSON?.() ?? null) ??
                [],
            _currentPoints: this._currentPoints ?? 0,

            _hourglasses: this._hourglasses ?? 0,
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
    static fromJSON(json: any): User {
        // creates a new user based on the json string data
        const user = new User(
            json._username ?? "",
            json._email ?? "",
            json._password ?? ""
        );

        // has alot of null checks, as typescript does not work wihtout these
        const collectionMap = new Map<PokemonCard, number>();
        if (Array.isArray(json._collection)) {
            for (const entry of json._collection) {
                try {
                    const card = PokemonCard.fromJSON(entry?.[0] ?? {});
                    const count = entry?.[1] ?? 0;
                    if (card) collectionMap.set(card, count);
                } catch (e) {
                    console.error("Failed to parse collection entry:", entry);
                }
            }
        }
        user._collection = collectionMap;

        user._decks = Array.isArray(json._decks)
            ? json._decks.map((deckData: any) => Deck.fromJSON(deckData ?? {}))
            : [];

        user._victories = Number(json._victories) || 0;
        user._gameStats = json._gameStats
            ? UserStats.fromJSON(json._gameStats)
            : new UserStats(0, 0, 0);
        user._winRate = Number(json._winRate) || 0;

        user._gameHistory = Array.isArray(json._gameHistory)
            ? json._gameHistory.map((record: any) =>
                  GameRecord.fromJSON(record ?? {})
              )
            : [];

        user._activeDeckName = json._activeDeckName ?? null;
        user._activeDeck = json._activeDeck
            ? Deck.fromJSON(json._activeDeck)
            : null;
        if (!user._activeCard) {
            user._activeCard = undefined as unknown as PokemonCard;
        } else {
            user._activeCard = PokemonCard.fromJSON(json._activeCard ?? {});
        }
        user._bench = Array.isArray(json._bench)
            ? json._bench.map((card: any) => PokemonCard.fromJSON(card ?? {}))
            : [];
        user._hand = Array.isArray(json._hand)
            ? json._hand.map((card: any) => PokemonCard.fromJSON(card ?? {}))
            : [];
        user._discardPile = Array.isArray(json._discardPile)
            ? json._discardPile.map((card: any) =>
                  PokemonCard.fromJSON(card ?? {})
              )
            : [];
        user._currentPoints = Number(json._currentPoints) || 0;

        user._hourglasses = Number(json._hourglasses) || 0;

        return user;
    }
}
