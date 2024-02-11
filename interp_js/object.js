const ObjectType = {
    INTEGER_OBJ: "INTEGER",
    BOOLEAN_OBJ: "BOOLEAN",
    NULL_OBJ: "NULL",
    RETURN_VALUE_OBJ: "RETURN_VALUE",
    ERROR_OBJ: "ERROR",
    FUNCTION_OBJ: "FUNCTION",
    STRING_OBJ: "STRING",
    BUILTIN_OBJ: "BUILTIN",
    ARRAY_OBJ: "ARRAY",
};

class IntegerObj {
    constructor(value) {
        this.value = value;
    }

    type() {
        return ObjectType.INTEGER_OBJ;
    }

    toString() {
        return `${this.value}`;
    }
}

class BooleanObj {
    constructor(value) {
        this.value = value;
    }

    type() {
        return ObjectType.BOOLEAN_OBJ;
    }

    toString() {
        return `${this.value}`;
    }
}

class NullObj {
    constructor() {
        this.value = null;
    }

    type() {
        return ObjectType.NULL_OBJ;
    }

    toString() {
        return "null";
    }
}

class ReturnValueObj {
    constructor(value) {
        this.returnValue = value;
    }

    type() {
        return ObjectType.RETURN_VALUE_OBJ;
    }

    toString() {
        return `${this.returnValue}`;
    }
}

class ErrorObj {
    constructor(message) {
        this.message = message;
    }

    type() {
        return ObjectType.ERROR_OBJ;
    }

    toString() {
        return `ERROR: ${this.message}`;
    }
}

class FunctionObj {
    constructor(params, body, env) {
        this.parameters = params;
        this.body = body;
        this.env = env;
    }

    type() {
        return ObjectType.FUNCTION_OBJ;
    }

    toString() {
        const p = this.parameters.map((p) => p.value);
        return `fn(${p.join(", ")}) {\n${this.body.toString()}\n}`;
    }
}

class StringObj {
    constructor(value) {
        this.value = value;
    }

    type() {
        return ObjectType.STRING_OBJ;
    }

    toString() {
        return this.value;
    }
}

class BuiltinFnObj {
    constructor(fn) {
        this.fn = fn;
    }

    type() {
        return ObjectType.BUILTIN_OBJ;
    }

    toString() {
        return "builtin function";
    }
}

class ArrayObj {
    constructor(elements) {
        this.elements = elements;
    }

    type() {
        return ObjectType.ARRAY_OBJ;
    }

    toString() {
        const values = [];
        for (const element of this.elements) {
            if (element.type() === ObjectType.FUNCTION_OBJ) {
                let ident = Object.keys(element.env.store).find((key) => {
                    return element.env.store[key] === element;
                });
                values.push(ident);
            } else {
                values.push(element.value);
            }
        }
        console.log("array: ", this);
        return `(${this.elements.length})[${values.join(", ")}]`;
    }
}

const TRUE = new BooleanObj(true);
const FALSE = new BooleanObj(false);
const NULL = new NullObj();

export {
    ObjectType,
    IntegerObj,
    BooleanObj,
    NullObj,
    ReturnValueObj,
    ErrorObj,
    FunctionObj,
    StringObj,
    BuiltinFnObj,
    ArrayObj,
    TRUE,
    FALSE,
    NULL,
};
