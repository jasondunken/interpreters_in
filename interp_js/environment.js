class Environment {
    constructor() {
        this.store = {};
    }

    get(name) {
        return this.store[name];
    }

    set(name, value) {
        this.store[name] = value;
    }
}

export { Environment };
