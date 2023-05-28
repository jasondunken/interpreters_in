import { Token, Tokens } from "./token.js";

class Tokenizer {
    input;
    position;
    readPosition;
    ch;

    constructor(input) {
        this.input = input;
        this.initialize();
    }

    initialize() {
        this.position = 0;
        this.readPosition = 0;
        this.readChar();
    }

    readChar() {
        if (this.readPosition >= this.input.length) {
            this.ch = "\0";
        } else {
            this.ch = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition++;
    }

    peekChar() {
        if (this.readPosition >= this.input.length) {
            return "\0";
        } else return this.input[this.readPosition];
    }

    nextToken() {
        let token = new Token();

        this.ignoreWhitespace();

        switch (this.ch) {
            case Tokens.ASSIGN.literal:
                if (this.ch + this.peekChar() === Tokens.EQ.literal) {
                    this.readChar();
                    token = new Token(Tokens.EQ.token, Tokens.EQ.literal);
                } else token = new Token(Tokens.ASSIGN.token, this.ch);
                break;
            case Tokens.PLUS.literal:
                token = new Token(Tokens.PLUS.token, this.ch);
                break;
            case Tokens.MINUS.literal:
                token = new Token(Tokens.MINUS.token, this.ch);
                break;
            case Tokens.BANG.literal:
                if (this.ch + this.peekChar() === Tokens.NOT_EQ.literal) {
                    this.readChar();
                    token = new Token(Tokens.NOT_EQ.token, Tokens.NOT_EQ.literal);
                } else token = new Token(Tokens.BANG.token, this.ch);
                break;
            case Tokens.ASTERISK.literal:
                token = new Token(Tokens.ASTERISK.token, this.ch);
                break;
            case Tokens.SLASH.literal:
                token = new Token(Tokens.SLASH.token, this.ch);
                break;
            case Tokens.LT.literal:
                token = new Token(Tokens.LT.token, this.ch);
                break;
            case Tokens.GT.literal:
                token = new Token(Tokens.GT.token, this.ch);
                break;
            case Tokens.EQ.literal:
                token = new Token(Tokens.EQ.token, this.ch);
                break;
            case Tokens.NOT_EQ.literal:
                token = new Token(Tokens.NOT_EQ.token, this.ch);
                break;
            case Tokens.COMMA.literal:
                token = new Token(Tokens.COMMA.token, this.ch);
                break;
            case Tokens.SEMICOLON.literal:
                token = new Token(Tokens.SEMICOLON.token, this.ch);
                break;
            case Tokens.LPAREN.literal:
                token = new Token(Tokens.LPAREN.token, this.ch);
                break;
            case Tokens.RPAREN.literal:
                token = new Token(Tokens.RPAREN.token, this.ch);
                break;
            case Tokens.LBRACE.literal:
                token = new Token(Tokens.LBRACE.token, this.ch);
                break;
            case Tokens.RBRACE.literal:
                token = new Token(Tokens.RBRACE.token, this.ch);
                break;
            case Tokens.EOF.literal:
                token = new Token(Tokens.EOF.token, "\0");
                break;
            default:
                if (this.isLetter(this.ch)) {
                    token.literal = this.readIdentifier();
                    token.token = Token.lookupIdentity(token.literal);
                    // need to return early here, readIdentifier has advanced the read position
                    return token;
                }
                if (this.isNumber(this.ch)) {
                    token.literal = this.readValue();
                    token.token = Tokens.INT.token;
                    // need to return early here, readValue has advanced the read position
                    return token;
                } else {
                    token = new Token(Tokens.ILLEGAL.token, this.ch);
                }
        }
        this.readChar();
        return token;
    }

    readIdentifier() {
        let startPosition = this.position;
        while (this.isLetter(this.ch)) {
            this.readChar();
        }
        return this.input.substring(startPosition, this.position);
    }

    isLetter(ch) {
        const l = ch.charCodeAt(0);
        // a-z | A-Z | _
        return (l >= 65 && l < 91) || (l >= 97 && l < 123) || l == 95;
    }

    readValue() {
        let startPosition = this.position;
        while (this.isNumber(this.ch)) {
            this.readChar();
        }
        return this.input.substring(startPosition, this.position);
    }

    isNumber(ch) {
        const n = ch.charCodeAt(0);
        return n >= 48 && n < 58;
    }

    ignoreWhitespace() {
        while (this.ch === " " || this.ch === "\t" || this.ch === "\r" || this.ch === "\n") {
            this.readChar();
        }
    }
}

export { Tokenizer };
