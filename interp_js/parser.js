import { Log } from "./logger.js";
import {
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
    PrefixExpression,
    InfixExpression,
    CallExpression,
    StringLiteral,
    ArrayLiteral,
    IndexExpression,
} from "./ast.js";
import { Tokens } from "./token.js";

const PRECEDENCE = {
    _: 0,
    LOWEST: 1,
    EQUALS: 2,
    LESSGREATER: 3,
    SUM: 4,
    PRODUCT: 5,
    PREFIX: 6,
    CALL: 7,
    INDEX: 8,
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
    LPAREN: PRECEDENCE.CALL,
    LBRACKET: PRECEDENCE.INDEX,
};

class Parser {
    curToken = null;
    peekToken = null;

    prefixParseFns = new Map();
    infixParseFns = new Map();

    errors = [];

    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        // prime current and peek tokens
        this.nextToken();
        this.nextToken();

        this.registerPrefix(Tokens.IDENT.token, this.parseIdentifier);
        this.registerPrefix(Tokens.INT.token, this.parseIntegerLiteral);
        this.registerPrefix(Tokens.TRUE.token, this.parseBoolean);
        this.registerPrefix(Tokens.FALSE.token, this.parseBoolean);
        this.registerPrefix(Tokens.BANG.token, this.parsePrefixExpression);
        this.registerPrefix(Tokens.MINUS.token, this.parsePrefixExpression);
        this.registerPrefix(Tokens.IF.token, this.parseIfExpression);
        this.registerPrefix(Tokens.LPAREN.token, this.parseGroupedExpression);
        this.registerPrefix(Tokens.FUNCTION.token, this.parseFunctionLiteral);
        this.registerPrefix(Tokens.STRING.token, this.parseStringLiteral);
        this.registerPrefix(Tokens.LBRACKET.token, this.parseArrayLiteral);

        this.registerInfix(Tokens.PLUS.token, this.parseInfixExpression);
        this.registerInfix(Tokens.MINUS.token, this.parseInfixExpression);
        this.registerInfix(Tokens.SLASH.token, this.parseInfixExpression);
        this.registerInfix(Tokens.ASTERISK.token, this.parseInfixExpression);
        this.registerInfix(Tokens.EQ.token, this.parseInfixExpression);
        this.registerInfix(Tokens.NOT_EQ.token, this.parseInfixExpression);
        this.registerInfix(Tokens.LT.token, this.parseInfixExpression);
        this.registerInfix(Tokens.GT.token, this.parseInfixExpression);
        this.registerInfix(Tokens.LPAREN.token, this.parseCallExpression);
        this.registerInfix(Tokens.LBRACKET.token, this.parseIndexExpression);
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
            this.peekError(token);
            return false;
        }
    }

    peekError(token) {
        Log.error(this.constructor.name, `expect peek error! token: ${token}`);
        this.errors.push(`expected next token to be ${token}, got ${this.peekToken.token}`);
    }

    parse() {
        const program = new Program();
        while (!this.curTokenIs(Tokens.EOF.token)) {
            const statement = this.parseStatement();
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

        if (!this.expectPeek(Tokens.IDENT.token)) return null;

        statement.name = new Identifier(this.curToken, this.curToken.literal);

        if (!this.expectPeek(Tokens.ASSIGN.token)) return null;

        this.nextToken();

        statement.value = this.parseExpression(PRECEDENCE.LOWEST);

        if (this.peekTokenIs(Tokens.SEMICOLON.token)) {
            this.nextToken();
        }
        return statement;
    }

    parseReturnStatement() {
        const statement = new ReturnStatement(this.curToken);
        this.nextToken();

        statement.returnValue = this.parseExpression(PRECEDENCE.LOWEST);

        if (this.peekTokenIs(Tokens.SEMICOLON.token)) {
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

    parseBlockStatement() {
        const block = new BlockStatement(this.curToken);

        this.nextToken();

        while (!this.curTokenIs(Tokens.RBRACE.token) && !this.curTokenIs(Tokens.EOF)) {
            const statement = this.parseStatement();
            if (statement) {
                block.statements.push(statement);
            }

            this.nextToken();
        }
        return block;
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

    parseGroupedExpression(self) {
        self.nextToken();

        const expression = self.parseExpression(PRECEDENCE.LOWEST);
        if (!self.expectPeek(Tokens.RPAREN.token)) {
            return null;
        }
        return expression;
    }

    parseIfExpression(self) {
        const expression = new IfExpression(self.curToken.token);

        if (!self.expectPeek(Tokens.LPAREN.token)) return null;

        self.nextToken();

        expression.condition = self.parseExpression(PRECEDENCE.LOWEST);

        if (!self.expectPeek(Tokens.RPAREN.token)) return null;
        if (!self.expectPeek(Tokens.LBRACE.token)) return null;

        expression.consequence = self.parseBlockStatement();

        if (self.peekTokenIs(Tokens.ELSE.token)) {
            self.nextToken();
            if (!self.expectPeek(Tokens.LBRACE.token)) return null;

            expression.alternative = self.parseBlockStatement();
        }
        return expression;
    }

    parseCallExpression(self, func) {
        const expression = new CallExpression(self.curToken, func);
        expression.arguments = self.parseExpressionList(Tokens.RPAREN.token);
        return expression;
    }

    parseCallArguments() {
        const args = []; // Expression[]
        if (this.peekTokenIs(Tokens.RPAREN.token)) {
            this.nextToken();
            return args;
        }

        this.nextToken();
        args.push(this.parseExpression(PRECEDENCE.LOWEST));

        while (this.peekTokenIs(Tokens.COMMA.token)) {
            this.nextToken();
            this.nextToken();
            args.push(this.parseExpression(PRECEDENCE.LOWEST));
        }

        if (!this.expectPeek(Tokens.RPAREN.token)) return null;

        return args;
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

    parseFunctionLiteral(self) {
        const literal = new FunctionLiteral(self.curToken);
        if (!self.expectPeek(Tokens.LPAREN.token)) return null;

        literal.parameters = self.parseFunctionParameters();

        if (!self.expectPeek(Tokens.LBRACE.token)) return null;

        literal.body = self.parseBlockStatement();
        return literal;
    }

    parseFunctionParameters() {
        const identifiers = [];
        if (this.peekTokenIs(Tokens.RPAREN.token)) {
            this.nextToken();
            return identifiers;
        }

        this.nextToken();

        let identity = new Identifier(this.curToken, this.curToken.literal);
        identifiers.push(identity);
        while (this.peekTokenIs(Tokens.COMMA.token)) {
            this.nextToken();
            this.nextToken();

            identity = new Identifier(this.curToken, this.curToken.literal);
            identifiers.push(identity);
        }
        if (!this.expectPeek(Tokens.RPAREN.token)) return null;
        return identifiers;
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

    parseStringLiteral(self) {
        return new StringLiteral(self.curToken, self.curToken.literal);
    }

    parseArrayLiteral(self) {
        const array = new ArrayLiteral(self.curToken);
        array.elements = self.parseExpressionList(Tokens.RBRACKET.token);
        return array;
    }

    parseBoolean(self) {
        return new Boolean(self.curToken, self.curTokenIs(Tokens.TRUE.token));
    }

    parseExpressionList(end) {
        const list = [];
        if (this.peekTokenIs(end)) {
            this.nextToken();
            return list;
        }

        this.nextToken();
        list.push(this.parseExpression(PRECEDENCE.LOWEST));
        while (this.peekTokenIs(Tokens.COMMA.token)) {
            this.nextToken();
            this.nextToken();
            list.push(this.parseExpression(PRECEDENCE.LOWEST));
        }
        if (!this.expectPeek(end)) {
            return null;
        }
        return list;
    }

    parsePrefixExpression(self) {
        const expression = new PrefixExpression(self.curToken, self.curToken.literal);
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

    parseIndexExpression(self, left) {
        const expression = new IndexExpression(self.curToken, left);

        self.nextToken();
        expression.index = self.parseExpression(PRECEDENCE.LOWEST);

        if (!self.expectPeek(Tokens.RBRACKET.token)) {
            return null;
        }

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
