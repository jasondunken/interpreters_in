class Object {
    type() {}
    inspect() {}
}

const ObjectType = {
    INTEGER_OBJ: "INTEGER",
    BOOLEAN_OBJ: "BOOLEAN",
    NULL_OBJ: "NULL",
    RETURN_VALUE_OBJ: "RETURN_VALUE",
    ERROR_OBJ: "ERROR",
    FUNCTION_OBJ: "FUNCTION",
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
        this.value = null;
    }

    type() {
        return ObjectType.NULL_OBJ;
    }

    inspect() {
        return "null";
    }
}

class ReturnValue extends Object {
    constructor(value) {
        super();
        this.returnValue = value;
    }

    type() {
        return ObjectType.RETURN_VALUE_OBJ;
    }

    inspect() {
        return `${this.returnValue}`;
    }
}

class Error extends Object {
    constructor(message) {
        super();
        this.message = message;
    }

    type() {
        return ObjectType.ERROR_OBJ;
    }

    string() {
        return `ERROR: ${this.message}`;
    }
}

class FunctionObj extends Object {
    constructor(node, env) {
        super();
        this.parameters = node.parameters;
        this.body = node.body.toString();
        this.env = env;
    }

    type() {
        return ObjectType.FUNCTION_OBJ;
    }

    inspect() {
        const p = this.parameters.map((p) => p.string());
        return `fn(${p.join(", ")}) {\n${this.body.string()}\n}`;
    }
}

export { ObjectType, Integer, Boolean, Null, ReturnValue, Error, FunctionObj };
