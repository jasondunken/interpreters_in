import { Tokenizer } from "../tokenizer.js";
import { Parser } from "../parser.js";

import { Log } from "../logger.js";

export function testLetStatements() {
    Log.info("Parser Test", "testing parseLetStatement()");
    const input = `
        let x = 5;
        let y = 10;
        let foobar = 838383;    
    `;

    const tests = ["x", "y", "foobar"];
    let failed = 0;

    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);

    const program = parser.parse();
    if (!program) {
        Log.error("Parser Test", "program parsing failed!");
        return { totalTests: tests.length, failed: tests.length };
    }
    if (program.statements.length != tests.length) {
        Log.error("Parser Test", "program does not contain the correct number of statements!");
        return { totalTests: tests.length, failed: tests.length };
    }

    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const passed = testLetStatement(statement, tests, i);
        if (!passed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testLetStatement(statement, tests, testIndex) {
    const expected = tests[testIndex];

    Log.info("Parser Test", `test[${testIndex}] expected 'let' got '${statement.token.literal}'`);
    if (statement.token.literal != "let") {
        Log.error("Parser Test", `test[${testIndex}] token literal not 'let'. got ${statement.token.literal}`);
        return false;
    }

    if (statement.constructor.name != "LetStatement") {
        Log.error(
            "Parser Test",
            `test[${testIndex}] statement type not LetStatement. got ${statement.constructor.name}`
        );
        return false;
    }

    if (statement.name.value != expected) {
        Log.error(
            "Parser Test",
            `test[${testIndex}] statement name value not ${expected}. got ${statement.name.value}`
        );
        return false;
    }

    if (statement.name.token.literal != expected) {
        Log.error(
            "Parser Test",
            `test[${testIndex}] statement name token literal not ${expected}. got ${statement.name.token.literal}`
        );
        return false;
    }
    return true;
}

export function testReturnStatements() {
    Log.info("Parser Test", "testing parseReturnStatement()");
    const input = `
        return 5;
        return 10;
        return 993322;
    `;

    const tests = [5, 10, 993322];
    let failed = 0;

    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);

    const program = parser.parse();
    if (!program) {
        Log.error("Parser Test", "program parsing failed!");
        return { totalTests: tests.length, failed: tests.length };
    }

    if (program.statements.length != tests.length) {
        Log.error("Parser Test", "program does not contain the correct number of statements!");
        return { totalTests: tests.length, failed: tests.length };
    }

    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        Log.info("Parser Test", `test[${i}] expected 'return' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ReturnStatement") {
            Log.error("ParserTest", `test[i] statement type not 'ReturnStatement', got ${statement.constructor.name}`);
            testFailed = true;
        }
        if (statement.token.literal != "return") {
            Log.error("ParserTest", `test[i] statement token literal not 'return', got ${statement.token.literal}`);
            testFailed = true;
        }
        if (statement.returnValue.value != tests[i]) {
            Log.error(
                "ParserTest",
                `test[i] statement return value not '${tests[i]}', got ${statement.returnValue.value}`
            );
            testFailed = true;
        }
        if (testFailed) {
            failed++;
        }
    }
    return { totalTests: tests.length, failedTests: failed };
}
