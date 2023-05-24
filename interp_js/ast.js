import { Tokens } from "./token.js";

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

class Statement extends Node {
    constructor(token) {
        super(token);
    }
    statementNode() {}
}

class Expression extends Node {
    constructor(token) {
        super(token);
    }
    expressionNode() {}
}

class LetStatement extends Statement {
    constructor(token) {
        super(token);
    }
    name;
    value;

    toString() {
        if (this.value) {
            return `${this.token.literal} ${this.name.token.literal} ${Tokens.ASSIGN.literal} ${this.value};`;
        }
        return `${this.token.literal} ${this.name.token.literal} ${Tokens.ASSIGN.literal};`;
    }
}

class ReturnStatement extends Statement {
    constructor(token) {
        super(token);
    }
    returnValue;

    toString() {
        if (this.returnValue) {
            return `${this.token.literal} ${this.returnValue.toString()};`;
        }
        return `${this.token.literal};`;
    }
}

class ExpressionStatement extends Statement {
    constructor(token) {
        super(token);
    }
    expression;

    toString() {
        if (this.expression) {
            return this.expression.toString();
        }
        return "";
    }
}

class BlockStatement extends Statement {
    constructor(token) {
        super(token);
        this.statements = []; // Statement[]
    }
    statements;

    toString() {
        let blockString = "";
        this.statements.forEach((statement) => {
            blockString += statement.toString();
        });
        return blockString;
    }
}

class Identifier extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

class FunctionLiteral extends Expression {
    constructor(token) {
        super(token);
        this.parameters = []; // Identifier
    }
    body; // BlockStatement

    toString() {
        const params = [];
        this.parameters.forEach((param) => {
            params.push(param.toString());
        });
        return `${this.tokenLiteral()}(${params.join(", ")}) ${this.body.toString()}`;
    }
}

class IntegerLiteral extends Expression {
    constructor(token) {
        super(token);
    }

    toString() {
        return this.token.literal;
    }
}

class Boolean extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }

    toString() {
        return this.token.literal;
    }
}

class IfExpression extends Expression {
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

class CallExpression extends Expression {
    constructor(token, func) {
        super(token);
        this.func = func;
        this.arguments = [];
    }
    func;

    toString() {
        const args = [];
        this.arguments.forEach((arg) => {
            args.push(arg.toString());
        });
        return `${this.func.toString()}(${args.join(", ")})`;
    }
}

class PrefixExpression extends Expression {
    constructor(token, operator) {
        super(token);
        this.operator = operator;
    }
    right;

    toString() {
        return `(${this.operator}${this.right})`;
    }
}

class InfixExpression extends Expression {
    constructor(token, operator, left) {
        super(token);
        this.operator = operator;
        this.left = left;
    }
    left;
    right;

    toString() {
        return `(${this.left} ${this.operator} ${this.right})`;
    }
}

export {
    Program,
    LetStatement,
    ReturnStatement,
    ExpressionStatement,
    BlockStatement,
    Identifier,
    FunctionLiteral,
    IntegerLiteral,
    Boolean,
    IfExpression,
    CallExpression,
    PrefixExpression,
    InfixExpression,
};
