import { Tokenizer } from "../tokenizer.js";
import { Parser } from "../parser.js";

import { Log } from "../logger.js";

function testLetStatements() {
    Log.info("Parser Test", "testing parseLetStatement()");
    const input = `
        let x = 5;
        let y = 10;
        let foobar = 838383;    
    `;

    const tests = [
        ["x", 5],
        ["y", 10],
        ["foobar", 838383],
    ];
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
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'let' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.token.literal != "let") {
            Log.error("Parser Test", `test[${i}] token literal not 'let' got '${statement.token.literal}'`);
            testFailed = true;
        }

        if (statement.constructor.name != "LetStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'LetStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (statement.name.value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement name value not '${expected[0]}' got '${statement.name.value}'`
            );
            testFailed = true;
        }

        if (statement.name.token.literal != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement name token literal not '${expected[0]}' got '${statement.name.token.literal}'`
            );
            testFailed = true;
        }

        if (statement.value.token.literal != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement value token literal not '${expected[1]}' got '${statement.value.token.literal}'`
            );
            testFailed = true;
        }

        if (statement.value.value != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement name value value not '${expected[1]}' got '${statement.value.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testReturnStatements() {
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
            Log.error(
                "ParserTest",
                `test[${i}] statement type not 'ReturnStatement', got '${statement.constructor.name}'`
            );
            testFailed = true;
        }
        if (statement.token.literal != "return") {
            Log.error(
                "ParserTest",
                `test[${i}] statement token literal not 'return', got '${statement.token.literal}'`
            );
            testFailed = true;
        }
        if (statement.returnValue.value != tests[i]) {
            Log.error(
                "ParserTest",
                `test[${i}] statement return value not '${tests[i]}', got '${statement.returnValue.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIdentifierExpressions() {
    Log.info("Parser Test", "testing parseIdentifierExpression()");
    const input = `
        foobar;
        test;
        x;
        a;
        this;
    `;

    const tests = ["foobar", "test", "x", "a", "this"];
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
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got ;${statement.constructor.name};`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "Identifier") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'Identifier', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.token.literal != tests[i]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression token literal not '${tests[i]}', got '${expression.token.literal}'`
            );
            testFailed = true;
        }
        if (expression.value != tests[i]) {
            Log.error("ParserTest", `test[${i}] expression value not '${tests[i]}', got '${expression.value}'`);
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIntegerLiteralExpressions() {
    Log.info("Parser Test", "testing parseIntegerLiteralExpression()");
    const input = `
        5;
        10;
        999;
    `;

    const tests = [5, 10, 999];
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
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got '${statement.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "IntegerLiteral") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'IntegerLiteral', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.token.literal != tests[i]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression token literal not '${tests[i]}', got '${expression.token.literal}'`
            );
            testFailed = true;
        }
        if (expression.value != tests[i]) {
            Log.error("ParserTest", `test[${i}] expression value not '${tests[i]}', got '${expression.value}'`);
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testParsingPrefixExpressions() {
    Log.info("Parser Test", "testing parsePrefixExpression()");
    const input = `
        -5;
        !10;
    `;

    const tests = [
        ["-", 5],
        ["!", 10],
    ];
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
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i][0]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got '${statement.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "PrefixExpression") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'PrefixExpression', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.operator != tests[i][0]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression operator not '${tests[i][0]}', got '${expression.operator}'`
            );
            testFailed = true;
        }
        if (expression.right.value != tests[i][1]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression value not '${tests[i][1]}', got '${expression.right.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testParsingInfixExpressions() {
    Log.info("Parser Test", "testing parseInfixExpression()");
    const input = `
        5 - 5;
        10 + 10;
        999 / 5;
        128 * 256;
        5 > 5;
        5 < 5;
        5 == 5;
        5 != 5
    `;

    const tests = [
        [5, "-", 5],
        [10, "+", 10],
        [999, "/", 5],
        [128, "*", 256],
        [5, ">", 5],
        [5, "<", 5],
        [5, "==", 5],
        [5, "!=", 5],
    ];
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
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i][1]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "InfixExpression") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'InfixExpression', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.token.literal != tests[i][1]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression token literal not '${tests[i][1]}', got '${expression.token.literal}'`
            );
            testFailed = true;
        }
        if (expression.left != tests[i][0]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression left value not '${tests[i][0]}', got '${expression.left.value}'`
            );
            testFailed = true;
        }
        if (expression.right != tests[i][2]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression right value not '${tests[i][2]}', got '${expression.right.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testOperatorPrecedenceParsing() {
    Log.info("Parser Test", "testing operator precedence parsing");
    const tests = [
        ["-a * b", "((-a) * b)"],
        ["!-a", "(!(-a))"],
        ["a + b + c", "((a + b) + c)"],
        ["a + b - c", "((a + b) - c)"],
        ["a * b * c", "((a * b) * c)"],
        ["a * b / c", "((a * b) / c)"],
        ["a + b / c", "(a + (b / c))"],
        ["a + b * c + d / e - f", "(((a + (b * c)) + (d / e)) - f)"],
        ["3 + 4; -5 * 5", "(3 + 4)((-5) * 5)"],
        ["5 > 4 == 3 < 4", "((5 > 4) == (3 < 4))"],
        ["5 < 4 != 3 > 4", "((5 < 4) != (3 > 4))"],
        ["3 + 4 * 5 == 3 * 1 + 4 * 5", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"],
        ["3 > 5 == false", "((3 > 5) == false)"],
        ["3 < 5 == true", "((3 < 5) == true)"],
        ["a + add(b * c) + d", "((a + add((b * c))) + d)"],
    ];
    let failed = 0;

    for (let i = 0; i < tests.length; i++) {
        const tokenizer = new Tokenizer(tests[i][0]);
        const parser = new Parser(tokenizer);
        const program = parser.parse();
        const result = program.toString();

        if (result != tests[i][1]) {
            Log.error("ParserTest", `test[${i}] input '${tests[i][0]}' expected '${tests[i][1]}' got '${result}'`);
            failed++;
        } else {
            Log.info("Parser Test", `test[${i}] input '${tests[i][0]}' got '${result}'`);
        }
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIfExpressions() {
    Log.info("Parser Test", "testing parseIfExpression()");
    const input = `
        if (x < y) { x };
        if (a > b) { a };   
        if (i == j) { j };   
    `;

    const tests = [
        ["x", "<", "y", "x"],
        ["a", ">", "b", "a"],
        ["i", "==", "j", "j"],
    ];
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
        const expression = statement.expression;
        const condition = expression.condition;
        const consequence = expression.consequence;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'if' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "IfExpression") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'IfExpression' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (condition.left.value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition left value not '${expected[0]}' got '${condition.left.value}'`
            );
            testFailed = true;
        }

        if (condition.operator != expected[1]) {
            Log.error("Parser Test", `test[${i}] condition operator not '${expected[1]}' got '${condition.operator}'`);
            testFailed = true;
        }

        if (condition.right.value != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition right value not '${expected[2]}' got '${condition.right.value}'`
            );
            testFailed = true;
        }

        if (consequence.statements[0].expression.value != expected[3]) {
            Log.error(
                "Parser Test",
                `test[${i}] consequence value not '${expected[3]}' got '${consequence.statements[0].expression.value}'`
            );
            testFailed = true;
        }

        if (expression.alternative) {
            Log.error("Parser Test", `test[${i}] alternative was not null got '${expression.alternative}'`);
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIfElseExpressions() {
    Log.info("Parser Test", "testing parseIfExpression() with else");
    const input = `
        if (x < y) { x } else { y };
        if (a > b) { a } else { b };   
        if (i == j) { j } else { null };   
    `;

    const tests = [
        ["x", "<", "y", "x", "y"],
        ["a", ">", "b", "a", "b"],
        ["i", "==", "j", "j", "null"],
    ];
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
        const expression = statement.expression;
        const condition = expression.condition;
        const consequence = expression.consequence;
        const alternative = expression.alternative;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'if' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "IfExpression") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'IfExpression' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (condition.left.value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition left value not '${expected[0]}' got '${condition.left.value}'`
            );
            testFailed = true;
        }

        if (condition.operator != expected[1]) {
            Log.error("Parser Test", `test[${i}] condition operator not '${expected[1]}' got '${condition.operator}'`);
            testFailed = true;
        }

        if (condition.right.value != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition right value not '${expected[2]}' got '${condition.right.value}'`
            );
            testFailed = true;
        }

        if (consequence.statements[0].expression.value != expected[3]) {
            Log.error(
                "Parser Test",
                `test[${i}] consequence value not '${expected[3]}' got '${consequence.statements[0].expression.value}'`
            );
            testFailed = true;
        }

        if (alternative.statements[0].expression.value != expected[4]) {
            Log.error(
                "Parser Test",
                `test[${i}] alternative value not '${expected[4]}' got '${alternative.statements[0].expression.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testFunctionLiteralParsing() {
    Log.info("Parser Test", "testing parseFunctionLiteral()");
    const input = `
        fn(x, y) { x + y; };
        fn(a, b) { b + a * a; };  
    `;

    const tests = [
        ["x", "y", "(x + y)"],
        ["a", "b", "(b + (a * a))"],
    ];
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
        const expression = statement.expression;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'fn' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "FunctionLiteral") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'FunctionLiteral' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.parameters[0].value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] function parameter 1 not '${expected[0]}' got '${expression.parameters[0].value}'`
            );
            testFailed = true;
        }
        if (expression.parameters[1].value != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] function parameter 2 not '${expected[1]}' got '${expression.parameters[1].value}'`
            );
            testFailed = true;
        }

        if (expression.body.statements[0].toString() != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition operator not '${expected[2]}' got '${expression.body.statements[0].toString()}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testCallExpressionParsing() {
    Log.info("Parser Test", "testing parseCallArguments()");
    const input = `
        add(1, 2 * 3, 4 + 5);
        add(x, y + z, z * 2);  
    `;

    const tests = [
        ["add", 1, "(2 * 3)", "(4 + 5)"],
        ["add", "x", "(y + z)", "(z * 2)"],
    ];
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
        const expression = statement.expression;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'add' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "CallExpression") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'CallExpression' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.arguments[0].toString() != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] call argument 1 not '${expected[1]}' got '${expression.arguments[0]}'`
            );
            testFailed = true;
        }
        if (expression.arguments[1].toString() != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] call argument 2 not '${expected[2]}' got '${expression.arguments[1]}'`
            );
            testFailed = true;
        }
        if (expression.arguments[2].toString() != expected[3]) {
            Log.error(
                "Parser Test",
                `test[${i}] call argument 3 not '${expected[3]}' got '${expression.arguments[2]}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

export {
    testLetStatements,
    testReturnStatements,
    testIdentifierExpressions,
    testIntegerLiteralExpressions,
    testParsingPrefixExpressions,
    testParsingInfixExpressions,
    testOperatorPrecedenceParsing,
    testIfExpressions,
    testIfElseExpressions,
    testFunctionLiteralParsing,
    testCallExpressionParsing,
};
