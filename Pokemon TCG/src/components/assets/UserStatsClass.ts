// users stats
export class UserStats {
    // properties // needs to be public to be accessed by the profile
    public wins: number;
    public losses: number;
    public currentStreak: number;

    // constructor
    constructor(
        wins: number = 0,
        losses: number = 0,
        currentStreak: number = 0
    ) {
        this.wins = wins;
        this.losses = losses;
        this.currentStreak = currentStreak;
    }

    // adds a win
    public addWin() {
        this.wins++;
        this.currentStreak += 1;
    }

    // adds a loss
    public addLoss() {
        this.losses++;
        this.currentStreak = 0;
    }

    // get WR
    public getWinPercentage(): number {
        const totalGames = this.wins + this.losses;
        return totalGames === 0 ? 0 : (this.wins / totalGames) * 100;
    }


    /**
     * serializes a array class into json string format
     * used to store or transfer the data
     * 
     * @returns returns a plain JS object representing the current state of the class with its properties
     */
    public toJSON() {
        return {
            wins: this.wins,
            losses: this.losses,
            currentStreak: this.currentStreak,
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
    public static fromJSON(json: any): UserStats {
        return new UserStats(json.wins, json.losses, json.currentStreak);
    }
}
