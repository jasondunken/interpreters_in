class Environment {
    constructor(store = {}, outer = null) {
        this.store = store;
        this.outer = outer;
    }

    get(name) {
        if (
            Object.keys(this.store).find((key) => {
                return key === name;
            })
        ) {
            return this.store[name];
        } else if (this.outer != null) {
            return this.outer.get(name);
        }
        return null;
    }

    set(name, value) {
        this.store[name] = value;
    }

    static newEnclosedEnvironment(outer) {
        const env = Environment.newEnvironment();
        env.outer = outer;
        return env;
    }

    static newEnvironment() {
        const store = {};
        return new Environment(store, null);
    }
}

export { Environment };
