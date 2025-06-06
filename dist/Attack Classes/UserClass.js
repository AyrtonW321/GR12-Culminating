export class User {
    _name;
    _cardCollection;
    constructor(name, cardCollection) {
        this._name = name;
        this._cardCollection = cardCollection;
    }
    get name() {
        return this._name;
    }
    get cardCollection() {
        return this._cardCollection;
    }
}
//# sourceMappingURL=UserClass.js.map