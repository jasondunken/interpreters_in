class Object {
    type() {}
    inspect() {}
}

const ObjectType = {
    INTEGER_OBJ: "INTEGER",
    BOOLEAN_OBJ: "BOOLEAN",
    NULL_OBJ: "NULL",
    ERROR_OBJ: "ERROR",
};

class Integer extends Object {
    constructor(value) {
        super();
        this.value = value;
    }

    type() {
        return ObjectType.INTEGER_OBJ;
    }

    inspect() {
        return `${this.value}`;
    }
}

class Boolean extends Object {
    constructor(value) {
        super();
        this.value = value;
    }

    type() {
        return ObjectType.BOOLEAN_OBJ;
    }

    inspect() {
        return `${this.value}`;
    }
}

class Null extends Object {
    constructor() {
        super();
    }

    type() {
        return ObjectType.NULL_OBJ;
    }

    inspect() {
        return "null";
    }
}

class Error extends Object {
    constructor() {
        super();
    }

    type() {
        return ObjectType.ERROR_OBJ;
    }
}

export { ObjectType, Integer, Boolean, Null, Error };
