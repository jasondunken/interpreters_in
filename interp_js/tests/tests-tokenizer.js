import { Tokenizer } from "../tokenizer.js";
import { Tokens } from "../token.js";

import { Log } from "../logger.js";

export function testNextToken() {
    Log.info("Tokenizer Test", "testing nextToken()");
    const input = `
        let five = 5;
        let ten = 10;
        let add = fn(x, y) {
            x + y;
        };
        let result = add(five, ten);
        !-/*5;
        5 < 10 > 5;
        
        if (5 < 10) {
            return true;
        } else {
            return false;
        }

        10 == 10;
        10 != 9;

        "foobar"
        "foo bar"
        
        `;

    const tokenizer = new Tokenizer(input);

    const tests = [
        [Tokens.LET, "let"],
        [Tokens.IDENT, "five"],
        [Tokens.ASSIGN, "="],
        [Tokens.INT, "5"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.LET, "let"],
        [Tokens.IDENT, "ten"],
        [Tokens.ASSIGN, "="],
        [Tokens.INT, "10"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.LET, "let"],
        [Tokens.IDENT, "add"],
        [Tokens.ASSIGN, "="],
        [Tokens.FUNCTION, "fn"],
        [Tokens.LPAREN, "("],
        [Tokens.IDENT, "x"],
        [Tokens.COMMA, ","],
        [Tokens.IDENT, "y"],
        [Tokens.RPAREN, ")"],
        [Tokens.LBRACE, "{"],
        [Tokens.IDENT, "x"],
        [Tokens.PLUS, "+"],
        [Tokens.IDENT, "y"],
        [Tokens.SEMICOLON, ";"],
        [Tokens.RBRACE, "}"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.LET, "let"],
        [Tokens.IDENT, "result"],
        [Tokens.ASSIGN, "="],
        [Tokens.IDENT, "add"],
        [Tokens.LPAREN, "("],
        [Tokens.IDENT, "five"],
        [Tokens.COMMA, ","],
        [Tokens.IDENT, "ten"],
        [Tokens.RPAREN, ")"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.BANG, "!"],
        [Tokens.MINUS, "-"],
        [Tokens.SLASH, "/"],
        [Tokens.ASTERISK, "*"],
        [Tokens.INT, "5"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.INT, "5"],
        [Tokens.LT, "<"],
        [Tokens.INT, "10"],
        [Tokens.GT, ">"],
        [Tokens.INT, "5"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.IF, "if"],
        [Tokens.LPAREN, "("],
        [Tokens.INT, "5"],
        [Tokens.LT, "<"],
        [Tokens.INT, "10"],
        [Tokens.RPAREN, ")"],
        [Tokens.LBRACE, "{"],
        [Tokens.RETURN, "return"],
        [Tokens.TRUE, "true"],
        [Tokens.SEMICOLON, ";"],
        [Tokens.RBRACE, "}"],
        [Tokens.ELSE, "else"],
        [Tokens.LBRACE, "{"],
        [Tokens.RETURN, "return"],
        [Tokens.FALSE, "false"],
        [Tokens.SEMICOLON, ";"],
        [Tokens.RBRACE, "}"],

        [Tokens.INT, "10"],
        [Tokens.EQ, "=="],
        [Tokens.INT, "10"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.INT, "10"],
        [Tokens.NOT_EQ, "!="],
        [Tokens.INT, "9"],
        [Tokens.SEMICOLON, ";"],

        [Tokens.STRING, "foobar"],
        [Tokens.STRING, "foo bar"],

        [Tokens.EOF, "\0"],
    ];
    let failed = 0;

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const token = tokenizer.nextToken();
        Log.info(`Tokenizer Test`, `test[${i}] expected ${test[0].token} '${test[1]}' got '${token.literal}'`);
        if (test[0].token !== token.token) {
            Log.error(`Tokenizer Test`, `test[${i}] token type wrong. expected '${test[0].token}' got ${token.token}`);
        }
        if (test[1] !== token.literal) {
            Log.error(`Tokenizer Test`, `test[${i}] token literal wrong. expected '${test[1]}' got ${token.literal}`);
        }
        if (test[0].token !== token.token || test[1] !== token.literal) {
            failed++;
        }
    }
    return { totalTests: tests.length, failedTests: failed };
}
