import { Tokens } from "./token.js";

const NODE_TYPE = {
    Program: "Program",
    LetStatement: "LetStatement",
    ReturnStatement: "ReturnStatement",
    ExpressionStatement: "ExpressionStatement",
    BlockStatement: "BlockStatement",
    Identifier: "Identifier",
    FunctionLiteral: "FunctionLiteral",
    IntegerLiteral: "IntegerLiteral",
    StringLiteral: "StringLiteral",
    ArrayLiteral: "ArrayLiteral",
    Boolean: "Boolean",
    IfExpression: "IfExpression",
    CallExpression: "CallExpression",
    PrefixExpression: "PrefixExpression",
    InfixExpression: "InfixExpression",
    IndexExpression: "IndexExpression",
};

class Program {
    statements = [];

    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral;
        } else return "";
    }

    toString() {
        let programString = "";
        this.statements.forEach((statement) => {
            programString += statement.toString();
        });
        return programString;
    }
}

class Node {
    token;

    constructor(token) {
        this.token = token;
    }

    tokenLiteral() {
        return this.token.literal;
    }

    toString() {}
}

class LetStatement extends Node {
    name;
    value;

    constructor(token) {
        super(token);
    }

    toString() {
        if (this.value) {
            return `${this.token.literal} ${this.name.token.literal} ${Tokens.ASSIGN.literal} ${this.value};`;
        }
        return `${this.token.literal} ${this.name.token.literal} ${Tokens.ASSIGN.literal};`;
    }
}

class ReturnStatement extends Node {
    returnValue;

    constructor(token) {
        super(token);
    }

    toString() {
        if (this.returnValue) {
            return `${this.token.literal} ${this.returnValue.toString()};`;
        }
        return `${this.token.literal};`;
    }
}

class ExpressionStatement extends Node {
    expression;

    constructor(token) {
        super(token);
    }

    toString() {
        if (this.expression) {
            return this.expression.toString();
        }
        return "";
    }
}

class BlockStatement extends Node {
    constructor(token) {
        super(token);
        this.statements = []; // Statement[]
    }

    toString() {
        let blockString = "";
        this.statements.forEach((statement) => {
            blockString += statement.toString();
        });
        return blockString;
    }
}

class Identifier extends Node {
    constructor(token, value) {
        super(token);
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

class FunctionLiteral extends Node {
    body; // BlockStatement

    constructor(token) {
        super(token);
        this.parameters = []; // Identifier
    }

    toString() {
        const params = [];
        this.parameters.forEach((param) => {
            params.push(param.toString());
        });
        return `${this.tokenLiteral()}(${params.join(", ")}) ${this.body.toString()}`;
    }
}

class StringLiteral extends Node {
    constructor(token, value) {
        super(token);
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

class IntegerLiteral extends Node {
    constructor(token) {
        super(token);
    }

    toString() {
        return this.token.literal;
    }
}

class ArrayLiteral extends Node {
    elements;
    constructor(token) {
        super(token);
    }

    toString() {
        let arr = [];
        for (let element of this.elements) {
            arr.push(element.value);
        }
        return `[${arr.join(", ")}]`;
    }
}

class HashLiteral extends Node {
    constructor(token, pairs = {}) {
        super(token);
        this.pairs = pairs;
    }

    toString() {
        return `{\n${Object.keys(this.pairs).map((key) => {
            return `\t${key}: ${this.pairs[key]},\n`;
        })}}`;
    }
}

class Boolean extends Node {
    constructor(token, value) {
        super(token);
        this.value = value;
    }

    toString() {
        return this.token.literal;
    }
}

class IfExpression extends Node {
    constructor(token, condition, consequence, alternative) {
        super(token);
        this.condition = condition; // Expression
        this.consequence = consequence; // BlockStatement
        this.alternative = alternative; // BlockStatement
    }

    toString() {
        let ifString = `if ${this.condition.toString()} ${this.consequence.toString()}`;
        if (this.alternative) {
            ifString += ` else ${this.alternative.toString()}`;
        }
        return ifString;
    }
}

class CallExpression extends Node {
    constructor(token, func) {
        super(token);
        this.func = func;
        this.arguments = [];
    }

    toString() {
        const args = [];
        this.arguments.forEach((arg) => {
            args.push(arg.toString());
        });
        return `${this.func.toString()}(${args.join(", ")})`;
    }
}

class PrefixExpression extends Node {
    right;

    constructor(token, operator) {
        super(token);
        this.operator = operator;
    }

    toString() {
        return `(${this.operator}${this.right})`;
    }
}

class InfixExpression extends Node {
    right;

    constructor(token, operator, left) {
        super(token);
        this.operator = operator;
        this.left = left;
    }

    toString() {
        return `(${this.left} ${this.operator} ${this.right})`;
    }
}

class IndexExpression extends Node {
    index;

    constructor(token, left) {
        super(token);
        this.left = left;
    }

    toString() {
        return `(${this.left.toString()}[${this.index}])`;
    }
}

export {
    NODE_TYPE,
    Program,
    LetStatement,
    ReturnStatement,
    ExpressionStatement,
    BlockStatement,
    Identifier,
    FunctionLiteral,
    StringLiteral,
    IntegerLiteral,
    ArrayLiteral,
    HashLiteral,
    Boolean,
    IfExpression,
    CallExpression,
    PrefixExpression,
    InfixExpression,
    IndexExpression,
};
