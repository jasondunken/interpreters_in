import { Tokenizer } from "../tokenizer.js";
import { Tokens } from "../token.js";

import { Log } from "../cli.js";

export function testNextToken() {
    Log.LogInfo("Tokenizer Test", "test.nextToken");
    const input = `
        let five = 5;
        let ten = 10;
        let add = fn(x, y) {
            x + y;
        };
        let result = add(five, ten);`;

    const tokenizer = new Tokenizer(input);
    let failed = 0;

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
        [Tokens.EOF, "\0"],
    ];

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const token = tokenizer.nextToken();
        Log.LogInfo(`Tokenizer Test[${i}]`, `expected ${test[0].token} '${test[1]}' got '${token.literal}'`);
        if (test[0].token !== token.token) {
            Log.LogError(`Tokenizer Test[${i}]`, `token type wrong. expected '${test[0].token}' got ${token.token}`);
            failed++;
        }
        if (test[1] !== token.literal) {
            Log.LogError(`Tokenizer Test[${i}]`, `token literal wrong. expected '${test[1]}' got ${token.literal}`);
            failed++;
        }
    }
    return { totalTests: tests.length, failedTests: failed };
}
