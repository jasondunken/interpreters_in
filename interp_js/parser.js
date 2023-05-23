import { Program, LetStatement, ReturnStatement, Identifier } from "./ast.js";
import { Token, Tokens } from "./token.js";

class Parser {
    curToken = null;
    peekToken = null;

    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.errors = [];
        this.initialize();
    }

    initialize() {
        // set both tokens
        this.nextToken();
        this.nextToken();
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

    getErrors() {
        return this.errors;
    }

    peekError(token) {
        this.errors.push(`expected next token to be ${token}, got ${this.peekToken.token}`);
    }

    parse() {
        const program = new Program();
        while (!this.curTokenIs(Tokens.EOF.token)) {
            const statement = this.parseStatement();
            //console.log("parsed statement: ", statement);
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
                return null;
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

        // TODO: skipping expressions for now;

        while (!this.curTokenIs(Tokens.SEMICOLON.token)) {
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
}

export { Parser };
