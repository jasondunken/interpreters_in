import { Tokens } from "./token.js";

class Program {
    statements = [];

    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral;
        } else return "";
    }

    toString() {
        let statementStrings = "";
        this.statements.forEach((statement) => {
            statementStrings += statement.toString() + "\n";
        });
        return statementStrings;
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

class Identifier extends Expression {
    constructor(token, value) {
        super(token);
        this.value = value;
    }

    toString() {
        return this.value;
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
    Identifier,
    IntegerLiteral,
    PrefixExpression,
    InfixExpression,
};
