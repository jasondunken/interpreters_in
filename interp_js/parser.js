import {
    Program,
    LetStatement,
    ReturnStatement,
    ExpressionStatement,
    Identifier,
    IntegerLiteral,
    PrefixExpression,
    InfixExpression,
} from "./ast.js";
import { Token, Tokens } from "./token.js";

const PRECEDENCE = {
    _: 0,
    LOWEST: 1,
    EQUALS: 2,
    LESSGREATER: 3,
    SUM: 4,
    PRODUCT: 5,
    PREFIX: 6,
    CALL: 7,
};

const PRECEDENCES = {
    EQ: PRECEDENCE.EQUALS,
    NOT_EQ: PRECEDENCE.EQUALS,
    LT: PRECEDENCE.LESSGREATER,
    GT: PRECEDENCE.LESSGREATER,
    PLUS: PRECEDENCE.SUM,
    MINUS: PRECEDENCE.SUM,
    SLASH: PRECEDENCE.PRODUCT,
    ASTERISK: PRECEDENCE.PRODUCT,
};

class Parser {
    curToken = null;
    peekToken = null;

    prefixParseFns = new Map();
    infixParseFns = new Map();

    errors = [];

    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.initialize();

        this.registerPrefix(Tokens.IDENT.token, this.parseIdentifier);
        this.registerPrefix(Tokens.INT.token, this.parseIntegerLiteral);
        this.registerPrefix(Tokens.BANG.token, this.parsePrefixExpression);
        this.registerPrefix(Tokens.MINUS.token, this.parsePrefixExpression);

        this.registerInfix(Tokens.PLUS.token, this.parseInfixExpression);
        this.registerInfix(Tokens.MINUS.token, this.parseInfixExpression);
        this.registerInfix(Tokens.SLASH.token, this.parseInfixExpression);
        this.registerInfix(Tokens.ASTERISK.token, this.parseInfixExpression);
        this.registerInfix(Tokens.EQ.token, this.parseInfixExpression);
        this.registerInfix(Tokens.NOT_EQ.token, this.parseInfixExpression);
        this.registerInfix(Tokens.LT.token, this.parseInfixExpression);
        this.registerInfix(Tokens.GT.token, this.parseInfixExpression);
    }

    initialize() {
        // prime both tokens
        this.nextToken();
        this.nextToken();
    }

    registerPrefix(tokenType, fn) {
        this.prefixParseFns.set(tokenType, fn);
    }

    registerInfix(tokenType, fn) {
        this.infixParseFns.set(tokenType, fn);
    }

    nextToken() {
        this.curToken = this.peekToken;
        this.peekToken = this.tokenizer.nextToken();
    }

    curTokenIs(token) {
        return this.curToken.token == token;
    }

    peekTokenIs(token) {
        return this.peekToken.token == token;
    }

    expectPeek(token) {
        if (this.peekTokenIs(token)) {
            this.nextToken();
            return true;
        } else {
            console.log("parser error!");
            this.peekError(token);
            return false;
        }
    }

    peekError(token) {
        this.errors.push(`expected next token to be ${token}, got ${this.peekToken.token}`);
    }

    parse() {
        const program = new Program();
        while (!this.curTokenIs(Tokens.EOF.token)) {
            const statement = this.parseStatement();
            console.log("parsed statement: ", statement);
            if (statement) {
                program.statements.push(statement);
            }
            this.nextToken();
        }
        return program;
    }

    parseStatement() {
        switch (this.curToken.token) {
            case Tokens.LET.token:
                return this.parseLetStatement();
            case Tokens.RETURN.token:
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();
        }
    }

    parseLetStatement() {
        const statement = new LetStatement(this.curToken);

        if (!this.expectPeek(Tokens.IDENT.token)) {
            return null;
        }

        statement.name = new Identifier(this.curToken, this.curToken.literal);

        if (!this.expectPeek(Tokens.ASSIGN.token)) {
            return null;
        }

        this.nextToken();

        statement.value = this.parseExpression(PRECEDENCE.LOWEST);

        while (this.peekTokenIs(Tokens.SEMICOLON.token)) {
            this.nextToken();
        }
        return statement;
    }

    parseReturnStatement() {
        const statement = new ReturnStatement(this.curToken);
        this.nextToken();

        // TODO: skipping expressions for now;

        while (!this.curTokenIs(Tokens.SEMICOLON.token)) {
            this.nextToken();
        }
        return statement;
    }

    parseExpressionStatement() {
        const statement = new ExpressionStatement(this.curToken);
        statement.expression = this.parseExpression(PRECEDENCE.LOWEST);

        if (this.peekTokenIs(Tokens.SEMICOLON.token)) {
            this.nextToken();
        }
        return statement;
    }

    parseExpression(precedence) {
        const prefixFn = this.prefixParseFns.get(this.curToken.token);
        if (!prefixFn) {
            this.noPrefixParseFnError(this.curToken.token);
            return null;
        }
        let leftExp = prefixFn(this);

        while (!this.peekTokenIs(Tokens.SEMICOLON.token) && precedence < this.peekPrecedence()) {
            const infixFn = this.infixParseFns.get(this.peekToken.token);
            if (!infixFn) {
                this.noInfixParseFnError(this.peekToken.token);
                return leftExp;
            }
            this.nextToken();
            leftExp = infixFn(this, leftExp);
        }

        return leftExp;
    }

    peekPrecedence() {
        if (PRECEDENCES[this.peekToken.token]) {
            return PRECEDENCES[this.peekToken.token];
        }
        return PRECEDENCE.LOWEST;
    }

    currentPrecedence() {
        if (PRECEDENCES[this.curToken.token]) {
            return PRECEDENCES[this.curToken.token];
        }
        return PRECEDENCE.LOWEST;
    }

    parseIdentifier(self) {
        return new Identifier(self.curToken, self.curToken.literal);
    }

    parseIntegerLiteral(self) {
        const literal = new IntegerLiteral(self.curToken);
        try {
            const value = parseInt(self.curToken.literal);
            literal.value = value;
        } catch (e) {
            this.errors.push(`could not parse ${self.curToken.literal} as integer`);
            return null;
        }

        return literal;
    }

    parsePrefixExpression(self) {
        const expression = new PrefixExpression(self.curToken.token, self.curToken.literal);
        self.nextToken();

        expression.right = self.parseExpression(PRECEDENCE.PREFIX);

        return expression;
    }

    parseInfixExpression(self, left) {
        const expression = new InfixExpression(self.curToken, self.curToken.literal, left);
        const precedence = self.currentPrecedence();
        self.nextToken();
        expression.right = self.parseExpression(precedence);

        return expression;
    }

    noPrefixParseFnError(tokenType) {
        this.errors.push(`no prefix parse function for ${tokenType} found`);
    }

    noInfixParseFnError(tokenType) {
        this.errors.push(`no infix parse function for ${tokenType} found`);
    }

    getErrors() {
        return this.errors;
    }
}

export { Parser };
